const express = require("express");
const router = express.Router();
const {
  createSticky,
  getStickies,
  deleteSticky,
} = require("../controllers/stickyController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSticky);
router.get("/", protect, getStickies);
router.delete("/:id", protect, deleteSticky);

module.exports = router;
