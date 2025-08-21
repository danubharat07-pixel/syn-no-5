const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  army_no: { type: String, unique: true },
  rank: String,
  name: String,
  role: { type: String, enum: ['CO', 'TrgOffr', 'TrgJCO', 'Student'], default: 'Student' },
  password: String,// models/User.js (excerpt)
course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null, index: true }

});

module.exports = mongoose.model('User', userSchema);
