const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

async function getAttendanceByDate(req, res) {
  try {
    const { courseId, date, session } = req.query;
    const attendance = await Attendance.findOne({
      course: courseId,
      date: new Date(date),
      session,
    })
      .populate("course", "courseName")
      .populate("students.student", "army_no rank name")
      .populate("takenBy", "army_no rank name");
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found for the specified date and course.",
      });
    }
    res.json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving attendance.", error: error.message });
  }
}

async function addOrUpdateAttendance(req, res) {
  try {
    const { courseId, date, takenBy, studentsAttendance, session } = req.body;
    const enrolledStudents = await User.find({
      role: "Student",
      courses: courseId,
    }).select("army_no rank name");

    const attendanceData = enrolledStudents.map((student) => {
      const providedAttendance = studentsAttendance.find(
        (att) => att.student.toString() === student._id.toString()
      );
      return {
        student: student._id,
        status: providedAttendance ? providedAttendance.status : "Absent",
        remarks: providedAttendance ? providedAttendance.remarks : "",
      };
    });

    const attendance = await Attendance.findOneAndUpdate(
      { course: courseId, date: new Date(date), session },
      {
        course: courseId,
        date: new Date(date),
        students: attendanceData,
        takenBy,
        session,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Error adding/updating attendance.",
      error: error.message,
    });
  }
}

module.exports = { getAttendanceByDate, addOrUpdateAttendance };
