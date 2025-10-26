const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

//Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'your_password',
  database: 'todo_db'
};


async function connectWithRetry() {
  while (true) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL');

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

      connection.end();
      break;
    } catch (err) {
      console.error('Database connection failed:', err.message);
      console.log('Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

(async () => {
  await connectWithRetry();
  const pool = mysql.createPool(dbConfig);

 
  // Get tasks
  
  app.get('/tasks', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM task WHERE completed = 0 ORDER BY date ASC LIMIT 5'
      );
      res.send(rows);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send({ error: 'Failed to fetch tasks' });
    }
  });

 
  // Create new task
  
  app.post('/tasks', async (req, res) => {
    try {
      const { title, description, date } = req.body;
      if (!title || title.trim() === '') return res.status(400).send({ error: 'Title required' });

      const [result] = await pool.execute(
        'INSERT INTO task (title, description, date) VALUES (?, ?, ?)',
        [title.trim(), description || null, date || null]
      );

      const [rows] = await pool.execute('SELECT * FROM task WHERE id = ?', [result.insertId]);
      res.status(201).send(rows[0]);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).send({ error: 'Failed to create task' });
    }
  });

 
  // Single PUT API: Edit or Done
 
  app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, date } = req.body || {};

    try {
      if (title || description || date) {
        // EDIT TASK
        if (!title || title.trim() === '') return res.status(400).send({ error: 'Title required' });

        const [result] = await pool.execute(
          'UPDATE task SET title = ?, description = ?, date = ?, completed = 0 WHERE id = ?',
          [title.trim(), description || null, date || null, id]
        );

        if (result.affectedRows === 0) return res.status(404).send({ error: 'Task not found' });

        const [rows] = await pool.execute('SELECT * FROM task WHERE id = ?', [id]);
        return res.send(rows[0]);
      } else {
        // MARK AS DONE 
        const [result] = await pool.execute(
          'UPDATE task SET completed = 1 WHERE id = ?',
          [id]
        );

        if (result.affectedRows === 0) return res.status(404).send({ error: 'Task not found' });

        return res.send({ success: true });
      }
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).send({ error: 'Failed to update task' });
    }
  });

  
  // Delete task

  app.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
      const [result] = await pool.execute('DELETE FROM task WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).send({ error: 'Task not found' });
      res.send({ success: true });
    } catch (err) {
      console.error('Error deleting task:', err);
      res.status(500).send({ error: 'Failed to delete task' });
    }
  });
  
  // Start server
  app.listen(3000, () => console.log('Server running on port 3000'));
})();
