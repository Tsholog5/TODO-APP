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

app.post('/api/register', async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  // Debug: Print received data
  console.log('Received data:', req.body);

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
        return res.status(500).json({ message: 'Internal Server Error' });
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
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
          });
      } catch (hashError) {
        console.error('Error hashing password:', hashError.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
