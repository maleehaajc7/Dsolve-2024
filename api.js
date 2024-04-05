const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./routes/auth');
const accommodationRoutes = require('./routes/accommodations');
const reviewRoutes = require('./routes/reviews');

router.use('/auth', authRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;