const mongoose = require('mongoose');

const baseFields = {
  s_no: Number,
  army_no: String,
  rank: String,
  name: String
};

const trainingEventSchema = new mongoose.Schema({
  ...baseFields,           // who created it (for traceability)
  title: String,
  description: String,
  start: Date,
  end: Date
}, { timestamps: true });

module.exports = mongoose.model('TrainingEvent', trainingEventSchema);
