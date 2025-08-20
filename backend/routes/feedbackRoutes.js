const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedback,
  getFeedbackByRole,
  getFeedbackStats,
  getMyFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// POST /api/feedback - Create new feedback (Students only)
router.post("/", createFeedback);

// GET /api/feedback/my-feedback - Get current user's feedback (Students only)
router.get("/my-feedback", getMyFeedback);

// GET /api/feedback - Get all feedback (CO, TrgOffr, TrgJCO only)
router.get("/", getAllFeedback);

// GET /api/feedback/stats - Get feedback statistics (CO, TrgOffr, TrgJCO only)
router.get("/stats", getFeedbackStats);

// GET /api/feedback/role/:role - Get feedback by role (CO, TrgOffr, TrgJCO only)
router.get("/role/:role", getFeedbackByRole);

// DELETE /api/feedback/:feedbackId - Delete own feedback (Students only)
router.delete("/:feedbackId", deleteFeedback);

module.exports = router;
