const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
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

  // 🟢 Create a new task
  app.post('/tasks', async (req, res) => {
    try {
      const { title, description, date } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO task (title, description, date) VALUES (?, ?, ?)', 
        [title, description, date]
      );
      res.send({ 
        id: result.insertId,
        title,
        description, 
        date,
        completed: false,
        created_at: new Date()
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).send({ error: 'Failed to create task' });
    }
  });

  // 🟢 Fetch recent incomplete tasks
  app.get('/tasks', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT 5'
      );
      res.send(rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send({ error: 'Failed to fetch tasks' });
    }
  });
  
  // 🟢 Health check endpoint
  app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
  });

  // 🟢 Mark task as completed
  app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
      await pool.execute('UPDATE task SET completed = TRUE WHERE id = ?', [id]);
      res.send({ success: true });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send({ error: 'Failed to update task' });
    }
  });

  // 🟢 Start server
  app.listen(3000, () => console.log('🚀 Server running on port 3000'));
})();
