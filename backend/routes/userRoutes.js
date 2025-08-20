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
  updateProfileImage,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/:userId/assign-course", assignCourseToUser);
router.post("/assign-course", bulkAssignCourse);
router.get("/getAllStudents", getAllStudents);
router.get("/getAllStudentsWithCourse", getAllStudentsWithCourse);
router.post("/addStudent", addStudent);
router.put(
  "/profile-image",
  protect,
  upload.single("file"),
  updateProfileImage
);
router.put("/:userId", updateUser);

module.exports = router;
