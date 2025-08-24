const PastTracker = require("../models/PastTracker");
const User = require("../models/User");
const mongoose = require("mongoose");

const getPastTracker = async (req, res) => {
  try {
    const { army_no, course, grade, courseDuration } = req.body;
    const filter = {};

    // If filtering by army_no, first find the user by army_no
    if (army_no) {
      filter.army_no = army_no;
    }

    if (course) {
      filter.course = course;
    }
    if (grade) {
      filter.grade = grade;
    }
    if (courseDuration) {
      filter.courseDuration = courseDuration;
    }

    // Populate user and course data for better response
    const pastTracker = await PastTracker.find(filter);

    res.json({ data: pastTracker, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPastTracker = async (req, res) => {
  try {
    const pastTracker = await PastTracker.create(req.body);
    res.json({ data: pastTracker, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alternative approach using aggregation pipeline (more efficient for complex queries)
const getPastTrackerWithAggregation = async (req, res) => {
  try {
    const { army_no, course, grade, courseDuration, rank, name } = req.body;

    const pipeline = [
      {
        $match: {
          ...(army_no && { army_no: new RegExp(army_no, "i") }),
          ...(rank && { rank: new RegExp(rank, "i") }),
          ...(course && { course: new RegExp(course, "i") }),
          ...(grade && { grade: new RegExp(grade, "i") }),
          ...(courseDuration && { courseDuration: parseInt(courseDuration) }),
        },
      },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          grade: 1,
          courseDuration: 1,
          remarks: 1,
          army_no: 1,
          rank: 1,
          name: 1,
          coy: 1,
          course: 1,
          ere: 1,
        },
      },
    ];

    const pastTracker = await PastTracker.aggregate(pipeline);
    res.json({ data: pastTracker, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPastTracker,
  addPastTracker,
  getPastTrackerWithAggregation,
};
