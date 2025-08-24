const mongoose = require("mongoose");

const pastTrackerSchema = new mongoose.Schema({
  army_no: { type: String, required: true },
  rank: { type: String, required: true },
  name: { type: String, required: true },
  coy: { type: String, required: true },
  course: { type: String, required: true },
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
