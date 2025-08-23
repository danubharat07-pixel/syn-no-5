const express = require("express");
const {
  createDailySchedule,
  getDailySchedule,
  deleteDailySchedule,
} = require("../controllers/dailyScheduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDailySchedule);
router.get("/", protect, getDailySchedule);
router.delete("/", protect, deleteDailySchedule);

module.exports = router;
