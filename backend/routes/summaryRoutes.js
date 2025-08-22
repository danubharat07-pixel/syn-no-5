const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createSummary,
  getSummary,
} = require("../controllers/summaryController");

router.post("/", protect, createSummary);
router.get("/", protect, getSummary);

module.exports = router;
