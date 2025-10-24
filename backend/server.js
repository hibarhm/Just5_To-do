const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'your_password', // Match docker-compose.yml
  database: 'todo_db'
};

async function connectWithRetry() {
  while (true) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL');
      await connection.execute('CREATE TABLE IF NOT EXISTS task (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, completed BOOLEAN DEFAULT FALSE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
      console.log('Task table created or already exists');
      connection.end(); // Close initial connection
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

  app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    const [result] = await pool.execute('INSERT INTO task (title, description) VALUES (?, ?)', [title, description]);
    res.send({ id: result.insertId });
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