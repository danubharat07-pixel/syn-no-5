const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/trainingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);

module.exports = router;
