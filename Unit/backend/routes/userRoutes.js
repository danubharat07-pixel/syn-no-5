const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile,assignCourseToUser,
  bulkAssignCourse } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.post('/users/:userId/assign-course', assignCourseToUser)
router.post('/users/assign-course', bulkAssignCourse);
module.exports = router;
