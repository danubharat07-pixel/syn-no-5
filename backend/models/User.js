const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  army_no: { type: String, unique: true },
  rank: String,
  name: String,
  role: {
    type: String,
    enum: ["CO", "TrgOffr", "TrgJCO", "Student"],
    default: "Student",
  },
  password: String, // models/User.js (excerpt)
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  event: {
    type: String,
    enum: ["bpet", "ppt", "firing", "written"],
    default: null,
  },
  result: {
    type: String,
    enum: ["good", "excellent", "satisfactory", "fail", "a", "b", "c"],
    default: null,
  },
  remarks: String,
});

module.exports = mongoose.model("User", userSchema);
