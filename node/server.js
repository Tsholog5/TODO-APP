// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Initialize SQLite database
app.use(cors());
app.use(express.json());

const initializeDatabase = () => {
  const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the SQLite database');
    }
  });

  // Create the table if it doesn't exist
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  });

  return db;
};

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { name, priority } = req.body;
  const db = initializeDatabase();

  db.run('INSERT INTO tasks (name, priority) VALUES (?, ?)', [name, priority], function (err) {
    db.close();
    if (err) {
      console.error('Error adding task:', err.message);
      res.status(500).json({ error: 'Failed to add task' });
    } else {
      res.status(201).json({ id: this.lastID, name, priority });
    }
  });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const db = initializeDatabase();

  db.all('SELECT * FROM tasks', [], (err, rows) => {
    db.close();
    if (err) {
      console.error('Error fetching tasks:', err.message);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const db = initializeDatabase();

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    db.close();
    if (err) {
      console.error('Error deleting task:', err.message);
      res.status(500).json({ error: 'Failed to delete task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, priority } = req.body;
  const db = initializeDatabase();

  db.run('UPDATE tasks SET name = ?, priority = ? WHERE id = ?', [name, priority, id], function (err) {
    db.close();
    if (err) {
      console.error('Error updating task:', err.message);
      res.status(500).json({ error: 'Failed to update task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ id, name, priority });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
