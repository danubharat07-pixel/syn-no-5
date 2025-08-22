const Feedback = require("../models/Feedback");
const User = require("../models/User");

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private (Students only)
const createFeedback = async (req, res) => {
  try {
    const {
      feedback,
      howToImprove,
      rating,
      isAnonymous,
      forRole: _forRole,
    } = req.body;
    const userId = req.user._id;

    const forRole = _forRole || "CO";

    // Check if user is a student
    if (req.user.role !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit feedback",
      });
    }

    // Validate required fields
    if (!forRole || !feedback || !howToImprove || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate forRole
    const validRoles = ["CO", "TrgOffr", "TrgJCO", "Student"];
    if (!validRoles.includes(forRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Create feedback
    const newFeedback = await Feedback.create({
      userId,
      forRole,
      feedback,
      howToImprove,
      rating,
      isAnonymous: isAnonymous || false,
    });

    // Populate user data for response
    await newFeedback.populate("userId", "army_no rank name");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (CO, TrgOffr, TrgJCO only)
const getAllFeedback = async (req, res) => {
  try {
    const { forRole, limit = 50, page = 1 } = req.query;

    // Check if user has permission to view feedback
    const allowedRoles = ["CO"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view feedback",
      });
    }

    const query = {};
    if (forRole) {
      query.forRole = forRole;
    }

    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(query)
      .populate("userId", "army_no rank name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get feedback by role
// @route   GET /api/feedback/role/:role
// @access  Private (CO, TrgOffr, TrgJCO only)
const getFeedbackByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Check if user has permission to view feedback
    const allowedRoles = ["CO", "TrgOffr", "TrgJCO"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view feedback",
      });
    }

    // Validate role
    const validRoles = ["CO", "TrgOffr", "TrgJCO", "Student"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ forRole: role })
      .populate("userId", "army_no rank name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Feedback.countDocuments({ forRole: role });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback by role:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private (CO, TrgOffr, TrgJCO only)
const getFeedbackStats = async (req, res) => {
  try {
    // Check if user has permission to view feedback
    const allowedRoles = ["CO", "TrgOffr", "TrgJCO"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view feedback statistics",
      });
    }

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$forRole",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalFeedback = await Feedback.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalFeedback,
        byRole: stats,
      },
    });
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get current user's feedback
// @route   GET /api/feedback/my-feedback
// @access  Private (Students only)
const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user is a student
    if (req.user.role !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their own feedback",
      });
    }

    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Feedback.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete user's own feedback
// @route   DELETE /api/feedback/:feedbackId
// @access  Private (Students only - can only delete their own)
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user._id;

    // Check if user is a student
    if (req.user.role !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Only students can delete feedback",
      });
    }

    // Find feedback and check ownership
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Check if the feedback belongs to the current user
    if (feedback.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own feedback",
      });
    }

    await Feedback.findByIdAndDelete(feedbackId);

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackByRole,
  getFeedbackStats,
  getMyFeedback,
  deleteFeedback,
};
