const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('accommodations.db');

// Get all accommodations
router.get('/', (req, res) => {
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
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});

// Get a specific accommodation
router.get('/:id', (req, res) => {
  const accommodationId = req.params.id;

  db.get('SELECT * FROM accommodations WHERE id = ?', [accommodationId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Accommodation not found' });
      return;
    }

    res.json(row);
  });
});

module.exports = router;