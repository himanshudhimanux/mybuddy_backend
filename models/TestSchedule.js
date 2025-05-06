// models/TestSchedule.js
const mongoose = require('mongoose');

const testScheduleSchema = new mongoose.Schema({
  testDate: {
    type: Date,
    required: true,
  },
  testTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestType',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  syllabus: {
    type: String,
  },
  comment: {
    type: String,
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
  sessionType: {
    type: String,
    enum: ['Single', 'Every Day', 'Weekly', 'Monthly'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Inactive'],
    default: 'Active',
  },
  maxMarks: Number,
  minMarks: Number,

},
{
  timestamps: true
}

);

module.exports = mongoose.model('TestSchedule', testScheduleSchema);
