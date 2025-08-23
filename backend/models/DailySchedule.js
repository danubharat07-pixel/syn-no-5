const mongoose = require("mongoose");

const dailyScheduleSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    activity: { type: String, required: true },
    instructor: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const DailySchedule = mongoose.model("DailySchedule", dailyScheduleSchema);

module.exports = DailySchedule;
