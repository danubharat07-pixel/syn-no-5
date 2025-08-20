const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  forRole: {
    type: String,
    enum: ["CO", "TrgOffr", "TrgJCO", "Student"],
    required: true,
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
  howToImprove: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

// Index for efficient querying
feedbackSchema.index({ forRole: 1, createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
