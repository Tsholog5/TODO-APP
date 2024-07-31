const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Function to check if a column exists
const checkColumnExists = (db, tableName, columnName, callback) => {
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      return callback(err);
    }
    const columnExists = columns.some(column => column.name === columnName);
    callback(null, columnExists);
  });
};

// Initialize database schema
db.serialize(() => {
  // Create tables if they do not exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    firstname TEXT,
    lastname TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    }
  });

  // Check for columns in the users table
  const requiredColumns = ['username', 'firstname', 'lastname', 'email'];
  requiredColumns.forEach(column => {
    checkColumnExists(db, 'users', column, (err, exists) => {
      if (err) {
        console.error('Error checking column existence:', err.message);
        return;
      }
      if (!exists) {
        db.run(`ALTER TABLE users ADD COLUMN ${column} TEXT`, (err) => {
          if (err) {
            console.error(`Error adding ${column} column:`, err.message);
          } else {
            console.log(`${column} column added to users table`);
          }
        });
      }
    });
  });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Internal Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
};

// Register a new user
app.post('/api/register', async (req, res, next) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Error checking email:', err.message);
        return next(err);
      }
      if (user) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run('INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
          [username, firstname, lastname, email, hashedPassword], function (err) {
            if (err) {
              console.error('Error registering user:', err.message);
              return next(err);
            }
            res.status(201).json({ message: 'User registered successfully!' });
          });
      } catch (hashError) {
        console.error('Error hashing password:', hashError.message);
        return next(hashError);
      }
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return next(error);
  }
});

// Add a new task
app.post('/api/tasks', (req, res, next) => {
  const { name, priority } = req.body;

  if (!name || !priority) {
    return res.status(400).json({ message: 'Please provide task name and priority.' });
  }

  db.run('INSERT INTO tasks (name, priority) VALUES (?, ?)', [name, priority], function (err) {
    if (err) {
      console.error('Error adding task:', err.message);
      return next(err);
    }
    res.status(201).json({ id: this.lastID, name, priority });
  });
});

// Get all tasks
app.get('/api/tasks', (req, res, next) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return next(err);
    }
    res.status(200).json(rows);
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res, next) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting task:', err.message);
      return next(err);
    } else if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

// Update a task
app.put('/api/tasks/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, priority } = req.body;

  if (!name || !priority) {
    return res.status(400).json({ message: 'Please provide task name and priority.' });
  }

  db.run('UPDATE tasks SET name = ?, priority = ? WHERE id = ?', [name, priority, id], function (err) {
    if (err) {
      console.error('Error updating task:', err.message);
      return next(err);
    } else if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ id, name, priority });
  });
});

// Use the error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
