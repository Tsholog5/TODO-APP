const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3001;
// Initialize SQLite database
const initializeDatabase = () => {
  return new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the SQLite database');
    }
  });
};
// Function to register a new user
const registerUser = (username, password) => {
  const db = initializeDatabase();
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");
    db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [username, password], (err) => {
      if (err) {
        console.error('Error registering user:', err.message);
      } else {
        console.log('User registered successfully');
      }
    });
  });
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
};
// Express middleware to parse JSON bodies
app.use(express.json());
// Express endpoint to handle user registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Call registerUser function
  registerUser(username, password);
  // Respond with success message
  res.status(200).json({ message: 'User registered successfully' });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});