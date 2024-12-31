const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    attendanceDateTime: { type: Date, default: Date.now },
    source: {
      type: String,
      enum: ['Face', 'Manual', 'RF Id Card'],
      required: true
    },
    attendanceType: {
      type: String,
      enum: ['In', 'Out'],
      required: true
    },
    notificationSent: { type: [String], enum: ['Push Notification', 'SMS', 'Mail', 'WhatsApp', 'Call'] },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  module.exports = mongoose.model('Attendance', attendanceSchema);
  