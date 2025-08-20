const express = require("express");
const router = express.Router();
const {
  getAttendanceByDate,
  addOrUpdateAttendance,
  getAttendanceByCourse,
  getStudentAttendanceHistory,
  getCourseAttendanceStats
} = require("../controllers/attendanceController");

// Get attendance by date (defaults to today)
router.get("/", getAttendanceByDate);

// Add or update attendance
router.post("/", addOrUpdateAttendance);

// Get attendance for a specific course
router.get("/course/:courseId", getAttendanceByCourse);

// Get attendance history for a specific student
router.get("/student/:studentId", getStudentAttendanceHistory);

// Get attendance statistics for a course
router.get("/course/:courseId/stats", getCourseAttendanceStats);

module.exports = router;
