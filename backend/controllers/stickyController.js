const Sticky = require("../models/Sticky");

async function createSticky(req, res) {
  try {
    const { content, role } = req.body;
    const sticky = await Sticky.create({
      content,
      createdBy: req.user._id,
      role,
    });
    res.status(201).json({ sticky });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getStickies(req, res) {
  try {
    const { role } = req.query;
    let query = {};
    if (role === "CO") {
      query = { role: "CO" };
    } else if (role === "TrgJCO") {
      query = { role: "TrgJCO" };
    }
    const stickies = await Sticky.find(query).populate("createdBy", "name");
    res.status(200).json({ data: stickies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createSticky,
  getStickies,
};
