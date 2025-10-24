const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
const app = express();

// Add CORS middleware
app.use(cors());
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
      // Add date column to your table
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
      console.log('Task table created or already exists');
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

  // Fix the POST endpoint to include date
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

  app.get('/tasks', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT 5');
    res.send(rows);
  });

  app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    await pool.execute('UPDATE task SET completed = TRUE WHERE id = ?', [id]);
    res.send({ success: true });
  });

  app.listen(3000, () => console.log('Server running on port 3000'));
})();