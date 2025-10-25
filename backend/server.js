const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
const http = require('http'); // ✅ for Socket.IO
const { Server } = require('socket.io'); // ✅ import Socket.IO

const app = express();

// 🟢 Enable CORS properly (frontend: 5173)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'your_password', 
  database: 'todo_db'
};

// 🔁 Keep retrying DB connection until ready
async function connectWithRetry() {
  while (true) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('✅ Connected to MySQL');

      // Ensure task table exists
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS task (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          title VARCHAR(255), 
          description TEXT, 
          date DATE,
          completed BOOLEAN DEFAULT FALSE, 
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('🗂️ Task table created or already exists');
      connection.end();
      break;
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      console.log('Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

(async () => {
  await connectWithRetry();

  const pool = mysql.createPool(dbConfig);

  // 🔹 Wrap Express app in HTTP server
  const server = http.createServer(app);

  // 🔹 Initialize Socket.IO
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
  });

  // 🔹 Socket.IO connection log
  io.on('connection', (socket) => {
    console.log('⚡ New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  // 🟢 Create a new task
  app.post('/tasks', async (req, res) => {
    try {
      const { title, description, date } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO task (title, description, date) VALUES (?, ?, ?)', 
        [title, description, date]
      );

      const newTask = { 
        id: result.insertId,
        title,
        description, 
        date,
        completed: false,
        created_at: new Date()
      };

      // 🔹 Emit to all clients
      io.emit('taskCreated', newTask);

      res.send(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).send({ error: 'Failed to create task' });
    }
  });

  // 🟢 Fetch all incomplete tasks (frontend will show top 5)
  app.get('/tasks', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM task WHERE completed = 0 ORDER BY date ASC'
      );
      res.send(rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send({ error: 'Failed to fetch tasks' });
    }
  });

  // 🟢 Mark task as completed
  app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id); // ✅ ensure ID is a number
    try {
      const [result] = await pool.execute(
        'UPDATE task SET completed = 1 WHERE id = ?', 
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Task not found' });
      }

      // 🔹 Emit completion event to all clients
      io.emit('taskCompleted', { id });

      res.send({ success: true });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send({ error: 'Failed to update task' });
    }
  });

  // 🟢 Delete a task
  app.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id.toString().trim()); // ⚡ trim to remove extra spaces/newlines
    try {
      const [result] = await pool.execute('DELETE FROM task WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Task not found' });
      }

      // 🔹 Emit deletion event to all clients
      io.emit('taskDeleted', { id });

      res.send({ success: true });
    } catch (err) {
      console.error('Error deleting task:', err);
      res.status(500).send({ error: 'Failed to delete task' });
    }
  });

  // 🟢 Health check endpoint
  app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
  });

  // 🔹 Start server with Socket.IO
  server.listen(3000, () => console.log('🚀 Server running with Socket.IO on port 3000'));
})();
