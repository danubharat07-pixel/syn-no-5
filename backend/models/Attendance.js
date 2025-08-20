const mongoose = require("mongoose");

// Sub-schema for individual student attendance
const studentAttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      default: "Absent",
      required: true,
    },
    reasonForAbsence: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "-",
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "-",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

// Main attendance schema for a specific day and course
const attendanceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          // Remove time component for date comparison
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return date <= today;
        },
        message: "Attendance date cannot be in the future",
      },
    },
    students: {
      type: [studentAttendanceSchema],
      required: true,
      validate: {
        validator: function (students) {
          return students.length > 0;
        },
        message: "At least one student must be included in attendance",
      },
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    session: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Full Day"],
      default: "Full Day",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound index to prevent duplicate attendance records for same course, date, and session
attendanceSchema.index({ course: 1, date: 1, session: 1 }, { unique: true });

// Index for efficient queries
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ "students.student": 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
