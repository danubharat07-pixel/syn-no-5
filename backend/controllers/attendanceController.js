const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Course = require("../models/Course");

// Helper function to validate and parse date
function parseDate(dateString) {
  if (!dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    return today;
  }

  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }

  parsedDate.setHours(0, 0, 0, 0); // Set to start of day
  return parsedDate;
}

async function getAttendanceByDate(req, res) {
  try {
    const { date, courseId } = req.query;

    // Use today's date if no date is provided
    let queryDate;
    if (date) {
      try {
        queryDate = parseDate(date);
      } catch (error) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    } else {
      // Default to today's date
      queryDate = parseDate(); // parseDate() with no argument returns today
    }

    const query = { date: queryDate };
    if (courseId) {
      query.course = courseId;
    }

    const attendance = await Attendance.find(query)
      .populate("course", "courseName duration")
      .populate("students.student", "army_no rank name");

    res.json({
      date: queryDate,
      attendance: attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attendance.",
      error: error.message,
    });
  }
}

async function addOrUpdateAttendance(req, res) {
  try {
    const { courseId, date, students, session } = req.body;

    // Validate required fields
    if (
      !courseId ||
      !students ||
      !Array.isArray(students) ||
      students.length === 0
    ) {
      return res.status(400).json({
        message: "Course ID and students array are required",
      });
    }

    // Validate and parse date - default to today if not provided
    let attendanceDate;
    if (date) {
      try {
        attendanceDate = parseDate(date);
      } catch (error) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    } else {
      // Default to today's date
      attendanceDate = parseDate(); // parseDate() with no argument returns today
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate all students exist
    const studentIds = students.map((s) => s.student);
    const validStudents = await User.find({
      _id: { $in: studentIds },
      role: "Student",
    });

    if (validStudents.length !== studentIds.length) {
      return res.status(400).json({
        message: "One or more students not found or not students",
      });
    }

    // Prepare students data with proper date
    const studentsData = students.map((student) => ({
      student: student.student,
      status: student.status || "Absent",
      reasonForAbsence: student.reasonForAbsence || "-",
      remarks: student.remarks || "-",
      date: attendanceDate,
    }));

    // Check if attendance already exists for this course, date, and session
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      date: attendanceDate,
      session: session || "Full Day",
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.students = studentsData;
      await existingAttendance.save();

      await existingAttendance.populate([
        { path: "course", select: "courseName" },
        { path: "students.student", select: "army_no rank name" },
      ]);

      res.json(existingAttendance);
    } else {
      // Create new attendance record
      const attendance = new Attendance({
        course: courseId,
        date: attendanceDate,
        students: studentsData,
        session: session || "Full Day",
      });

      await attendance.save();

      await attendance.populate([
        { path: "course", select: "courseName" },
        { path: "students.student", select: "army_no rank name" },
      ]);

      res.status(201).json(attendance);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error adding/updating attendance.",
      error: error.message,
    });
  }
}

// Get attendance records for a specific course
async function getAttendanceByCourse(req, res) {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const query = { course: courseId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        try {
          query.date.$gte = parseDate(startDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid start date format" });
        }
      }
      if (endDate) {
        try {
          query.date.$lte = parseDate(endDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid end date format" });
        }
      }
    }

    const attendance = await Attendance.find(query)
      .populate("course", "courseName duration")
      .populate("students.student", "army_no rank name")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving course attendance.",
      error: error.message,
    });
  }
}

// Get attendance history for a specific student
async function getStudentAttendanceHistory(req, res) {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, courseId } = req.query;

    // Validate student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const query = { "students.student": studentId };

    // Add course filter if provided
    if (courseId) {
      query.course = courseId;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        try {
          query.date.$gte = parseDate(startDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid start date format" });
        }
      }
      if (endDate) {
        try {
          query.date.$lte = parseDate(endDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid end date format" });
        }
      }
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("course", "courseName duration")
      .sort({ date: -1 });

    // Extract only the student's attendance data from each record
    const studentAttendance = attendanceRecords.map((record) => {
      const studentData = record.students.find(
        (s) => s.student.toString() === studentId
      );
      return {
        _id: record._id,
        course: record.course,
        date: record.date,
        session: record.session,
        attendance: studentData,
      };
    });

    res.json(studentAttendance);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving student attendance history.",
      error: error.message,
    });
  }
}

// Get attendance statistics for a course
async function getCourseAttendanceStats(req, res) {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const matchStage = { course: new mongoose.Types.ObjectId(courseId) };

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        try {
          matchStage.date.$gte = parseDate(startDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid start date format" });
        }
      }
      if (endDate) {
        try {
          matchStage.date.$lte = parseDate(endDate);
        } catch (error) {
          return res.status(400).json({ message: "Invalid end date format" });
        }
      }
    }

    const stats = await Attendance.aggregate([
      { $match: matchStage },
      { $unwind: "$students" },
      {
        $group: {
          _id: "$students.status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total attendance records count
    const totalRecords = await Attendance.countDocuments(matchStage);

    res.json({
      course: course.courseName,
      totalRecords,
      statistics: stats,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attendance statistics.",
      error: error.message,
    });
  }
}

module.exports = {
  getAttendanceByDate,
  addOrUpdateAttendance,
  getAttendanceByCourse,
  getStudentAttendanceHistory,
  getCourseAttendanceStats,
};
