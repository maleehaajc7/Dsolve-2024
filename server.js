// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use('/api', require('./routes/api'));

// Create SQLite database
const db = new sqlite3.Database('accommodations.db');

// Create accommodation table if not exists
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS accommodations (id INTEGER PRIMARY KEY, name TEXT, rent INTEGER)');
  db.run('INSERT INTO accommodations (name, rent) VALUES (?, ?)', ['Hostel A', 5000]);
  db.run('INSERT INTO accommodations (name, rent) VALUES (?, ?)', ['PG B', 6000]);
});

// API endpoint to fetch accommodations
app.get('/api/accommodations', (req, res) => {

  db.all('SELECT * FROM accommodations', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});

app.get('/hello',(req,res)=>{
  res.json({hi:"helloo"})
})

app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
