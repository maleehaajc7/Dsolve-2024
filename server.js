const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const accommodationRoutes = require('./routes/accommodations');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reviews', reviewRoutes);

// Create SQLite database
const db = new sqlite3.Database('accommodations.db');

// Create tables if not exists
db.serialize(() => {
  // Create 'users' table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )`);

  // Create 'accommodations' table
  db.run(`CREATE TABLE IF NOT EXISTS accommodations (
    id INTEGER PRIMARY KEY,
    name TEXT,
    rent INTEGER,
    amenities TEXT,
    type TEXT,
    gender TEXT,
    mess BOOLEAN,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  )`);

  // Create 'reviews' table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY,
    accommodation_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Insert sample data
bcrypt.hash('password', 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  db.serialize(() => {
    // Insert sample user data
    db.run('INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)', [
      'johndoe',
      'johndoe@example.com',
      hashedPassword,
    ]);

    // Insert sample accommodation data
    db.run('INSERT OR IGNORE INTO accommodations (name, rent, amenities, type, gender, mess, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      'Hostel A',
      5000,
      'Wi-Fi,AC,Attached Bathroom',
      'Hostel',
      'Male',
      true,
      1,
    ]);

    // Insert sample review data
    db.run('INSERT OR IGNORE INTO reviews (accommodation_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [
      1,
      1,
      4,
      'Great hostel, clean and well-maintained.',
    ]);
  });
});

// API endpoint to fetch accommodations
app.get('/api/accommodations', (req, res) => {
  const { amenities, type, gender, mess } = req.query;
  const filters = [];
  const filterValues = [];

  if (amenities) {
    filters.push('amenities LIKE ?');
    filterValues.push(`%${amenities}%`);
  }

  if (type) {
    filters.push('type = ?');
    filterValues.push(type);
  }

  if (gender) {
    filters.push('gender = ?');
    filterValues.push(gender);
  }

  if (mess !== undefined) {
    filters.push('mess = ?');
    filterValues.push(mess === 'true');
  }

  const filterClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  db.all(`SELECT * FROM accommodations ${filterClause}`, filterValues, (err, rows) => {
    if (err) {
      console.error('Error fetching accommodations data:', err);
      res.status(500).json({ error: 'Error fetching accommodations data' });
      return;
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});