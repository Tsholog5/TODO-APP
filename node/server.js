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

// Initialize database schema
db.serialize(() => {
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
});

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
            res.status(201).json({ message: 'User registered successfully!', userId: this.lastID });
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

// Login endpoint to get userId
app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [username], (err, user) => {
    if (err) {
      console.error('Error finding user:', err.message);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err.message);
        return next(err);
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.status(200).json({ userId: user.id });
    });
  });
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
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Failed to fetch tasks from database.' });
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
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
