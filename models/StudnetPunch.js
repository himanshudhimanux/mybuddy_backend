const mongoose = require('mongoose');

const studentPunchSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  punchTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: true,
  }
});

const StudentPunch = mongoose.model('StudentPunch', studentPunchSchema);
module.exports = StudentPunch;
