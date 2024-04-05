const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('accommodations.db');

// Get reviews for a specific accommodation
router.get('/:accommodationId', (req, res) => {
  const accommodationId = req.params.accommodationId;

  db.all('SELECT * FROM reviews WHERE accommodation_id = ?', [accommodationId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(rows);
  });
});

// Create a new review
router.post('/', (req, res) => {
  const { accommodationId, userId, rating, comment } = req.body;

  db.run('INSERT INTO reviews (accommodation_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [accommodationId, userId, rating, comment], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ message: 'Review created successfully', reviewId: this.lastID });
  });
});

module.exports = router;