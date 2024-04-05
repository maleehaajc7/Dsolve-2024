const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('accommodations.db');

// Register a new user
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ message: 'User registered successfully' });
  });
});

// User login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (!row) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Compare the provided password with the hashed password
    const passwordMatch = bcrypt.compareSync(password, row.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate a JSON Web Token
    const token = jwt.sign({ userId: row.id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ token });
  });
});

module.exports = router;