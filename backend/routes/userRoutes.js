const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  assignCourseToUser,
  bulkAssignCourse,
  getAllStudents,
  getAllStudentsWithCourse,
  updateUser,
  addStudent,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/:userId/assign-course", assignCourseToUser);
router.post("/assign-course", bulkAssignCourse);
router.get("/getAllStudents", getAllStudents);
router.get("/getAllStudentsWithCourse", getAllStudentsWithCourse);
router.put("/:userId", updateUser);
router.post("/addStudent", addStudent);

module.exports = router;
