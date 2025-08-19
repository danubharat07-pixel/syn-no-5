const Material = require("../models/Material");

async function createMaterial(req, res) {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, description, course, forRole, type } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File is required" });
    }

    const materialData = {
      title,
      description,
      type,
      forRole,
      link: req.file.path, // Use the uploaded file path
    };

    // Only add course if it's provided and not empty
    if (course && course.trim() !== "") {
      materialData.course = course;
    }

    const material = new Material(materialData);
    await material.save();
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    console.error("Error creating material:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getMaterials(req, res) {
  try {
    const { course, forRole } = req.query; // Changed from req.params to req.query
    const filterObj = {};
    if (course) {
      filterObj.course = course;
    }
    if (forRole) {
      filterObj.forRole = forRole;
    }
    // Filter for only last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    filterObj.createdAt = { $gte: twentyFourHoursAgo };
    
    const materials = await Material.find(filterObj).populate(
      "course",
      "courseName"
    );
    res.status(200).json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createMaterial, getMaterials };
