const express = require("express");
const {
  getPastTracker,
  addPastTracker,
  getPastTrackerWithAggregation,
} = require("../controllers/pastTrackerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/pastTracker - Get past tracker records with filters
router.post("/", getPastTracker);

// POST /api/pastTracker/add - Add new past tracker record
router.post("/add", protect, addPastTracker);

// POST /api/pastTracker/search - Advanced search using aggregation
router.post("/search", getPastTrackerWithAggregation);

module.exports = router;
