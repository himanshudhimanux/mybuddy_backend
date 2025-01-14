const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema({
  
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchStudent', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  batchDate: { type: Date, },
  status: {
    type: String,
    enum: ['Active', 'Holidays - Batch', 'Cancelled'],
    default: 'Active'
  },
  classType: {
    type: String,
    enum: ['Regular', 'Exam', 'Revision', 'Guest Lecture', 'Other'],
    default: 'Regular'
  },
  sessionMode: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  roomNo: { type: String, required: true },
  sessionType: { type: String, enum: ['Single', 'Daily', 'Weekly', 'Monthly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  recurrence: {
    daysOfWeek: [String], // For weekly sessions
    monthDay: Number,     // For monthly sessions
    monthGap: Number      // For monthly sessions
  },
  absenteeNotification: { type: Boolean, default: false },
  presentNotification: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true
}
);

module.exports = mongoose.model('ClassSession', classSessionSchema);