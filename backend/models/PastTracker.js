const mongoose = require("mongoose");

const pastTrackerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  grade: {
    type: String,
    enum: ["AXI", "AX", "A", "BXI", "BY", "C"],
    required: true,
  },
  courseDuration: { type: Number, required: true }, //no of weeks'
  remarks: { type: String, required: true },
  ere: { type: String, required: true },
});

const PastTracker = mongoose.model("PastTracker", pastTrackerSchema);

module.exports = PastTracker;
