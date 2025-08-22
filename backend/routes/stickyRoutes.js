const express = require("express");
const router = express.Router();
const {
  createSticky,
  getStickies,
} = require("../controllers/stickyController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSticky);
router.get("/", protect, getStickies);

module.exports = router;
