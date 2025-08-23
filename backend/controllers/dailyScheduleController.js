const DailySchedule = require("../models/DailySchedule");
const mongoose = require("mongoose");

async function createDailySchedule(req, res) {
  try {
    const { date, time, course, activity, instructor } = req.body;
    const dailySchedule = await DailySchedule.create({
      date,
      time,
      course,
      activity,
      instructor,
    });
    res.status(201).json(dailySchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getDailySchedule(req, res) {
  try {
    const { date, course } = req.query;
    let query = {};
    if (date) {
      query.date = new Date(date);
    }
    if (course) {
      query.course = mongoose.Types.ObjectId.isValid(course)
        ? new mongoose.Types.ObjectId(course)
        : null;
    }
    const dailySchedule = await DailySchedule.find(query).populate(
      "course",
      "courseName"
    );
    res.status(200).json({ data: dailySchedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteDailySchedule(req, res) {
  try {
    const { scheduleId } = req.query;
    await DailySchedule.findByIdAndDelete(scheduleId);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createDailySchedule, getDailySchedule, deleteDailySchedule };
