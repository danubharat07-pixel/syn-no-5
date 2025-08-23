const PastTracker = require("../models/PastTracker");
const User = require("../models/User");
const mongoose = require("mongoose");

const getPastTracker = async (req, res) => {
  try {
    const { army_no, course, grade, courseDuration } = req.body;
    const filter = {};

    // If filtering by army_no, first find the user by army_no
    if (army_no) {
      const user = await User.findOne({ army_no: army_no });
      if (!user) {
        return res.status(404).json({
          message: `User with army number ${army_no} not found`,
          success: false,
        });
      }
      filter.user = user._id; // Use the user's ObjectId
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
    const pastTracker = await PastTracker.find(filter)
      .populate("user", "army_no rank name")
      .populate("course", "courseName");

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
      // Join with users collection
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user array
      { $unwind: "$user" },
      // Join with courses collection
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      // Match conditions
      {
        $match: {
          ...(army_no && { "user.army_no": new RegExp(army_no, "i") }),
          ...(rank && { "user.rank": new RegExp(rank, "i") }),
          ...(course && { "course._id": new mongoose.Types.ObjectId(course) }),
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
          "user.army_no": 1,
          "user.rank": 1,
          "user.name": 1,
          "course.courseName": 1,
          "course._id": 1,
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
