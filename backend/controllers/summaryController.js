const Summary = require("../models/Summary");

async function createSummary(req, res) {
  try {
    const {
      sNo,
      course,
      totalStrength,
      presentStrength,
      absentStrength,
      result,
      remarks,
    } = req.body;
    const summary = await Summary.create({
      sNo,
      course,
      totalStrength,
      presentStrength,
      absentStrength,
      result,
      remarks,
    });
    res.status(201).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSummary(req, res) {
  try {
    const summary = await Summary.find()
      .populate("course", "courseName")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createSummary, getSummary };
