// routes/courses.js
const express = require("express");
const {
  createCourse,
  updateCourse,
  renameCourse,
  deleteCourse,
  getAllCourses,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/getAllCourses", getAllCourses);

// Create
router.post("/", createCourse);

// Update (all fields except courseName)
router.put("/:id", updateCourse);

// Rename (only courseName)
router.patch("/:id/rename", renameCourse);

// Delete
router.delete("/:id", deleteCourse);

module.exports = router;
