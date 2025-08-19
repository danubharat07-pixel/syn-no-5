// controllers/courseController.js
const mongoose = require("mongoose");
const Course = require("../models/Course");

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json({ success: true, data: course });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "courseName must be unique" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    if ("courseName" in req.body) {
      return res.status(400).json({
        success: false,
        message: "Use PATCH /:id/rename to change courseName",
      });
    }

    const course = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.json({ success: true, data: course });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const renameCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }
    if (!newName || typeof newName !== "string" || !newName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "newName is required" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (course.courseName === newName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "New name is same as current name" });
    }

    course.courseName = newName.trim();
    await course.save(); // triggers unique index + validators

    return res.json({ success: true, data: course });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "courseName must be unique" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.json({ success: true, data: { id: course._id.toString() } });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  renameCourse,
  deleteCourse,
};
