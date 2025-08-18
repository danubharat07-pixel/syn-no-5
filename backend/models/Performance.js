const mongoose = require('mongoose');

const baseFields = {
  s_no: Number,
  army_no: String,
  rank: String,
  name: String
};

const performanceSchema = new mongoose.Schema({
  ...baseFields,
  course_name: String,
  score: Number,
  date_completed: Date
});

module.exports = mongoose.model('Performance', performanceSchema);
