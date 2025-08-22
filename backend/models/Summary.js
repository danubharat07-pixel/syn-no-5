const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema(
  {
    forRole: {
      type: String,
      enum: ["CO", "TrgOffr", "TrgJCO", "Student"],
      default: "CO",
    },
    sNo: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    totalStrength: {
      type: Number,
      required: true,
    },
    presentStrength: {
      type: Number,
      required: true,
    },
    absentStrength: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: [
        "good",
        "excellent",
        "satisfactory",
        "fail",
        "a",
        "b",
        "c",
        "mm",
        "fc",
        "ss",
        "pass",
      ],
      default: null,
    },
    remarks: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
summarySchema.index({ forRole: 1, createdAt: -1 });

module.exports = mongoose.model("Summary", summarySchema);
