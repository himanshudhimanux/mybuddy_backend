const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  batchClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BatchClass',
    required: true,
  },
  batchDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Holidays - Calendar', 'Holidays - Batch', 'Cancelled'],
    required: true,
  },
  classType: {
    type: String,
    enum: ['Regular', 'Exam', 'Revision', 'Guest Lecture', 'Other'],
    required: true,
  },
  sessionMode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  sessionType: {
    type: String,
    enum: ['Single', 'Every Day', 'Weekly', 'Monthly'],
    required: true,
  },
  scheduleDetails: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    weeklyDays: [String], // Only for Weekly
    repeatEvery: { type: Number }, // For Weekly/Monthly
    onDay: { type: Number }, // For Monthly
    onThe: { type: String }, // For Monthly (e.g., 'First', 'Second')
  },
  roomNo: {
    type: String,
    default: '', // Optional: you can make it required if needed
  },
  absentNotification: {
    type: Boolean,
    default: false,
  },
  presentNotification: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
