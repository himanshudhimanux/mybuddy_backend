const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema({
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    facultyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    startDate: { type: Date, required: true },
    expectedEndDate: { type: Date },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Holidays - Batch', 'Cancelled'],
      default: 'Active'
    },
    sessionType: {
      type: String,
      enum: ['Regular', 'Exam', 'Revision', 'Guest Lecture', 'Other'],
      default: 'Regular'
    },
    sessionMode: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline'
    },
    comments: { type: String },
    attendanceStartTime: { type: String, enum: ['1/2 hour before', '1 hour before', '2 hours before', '5 hours before', 'same day'], default:'1 hour before', required: true },
    absenteeNotification: { type: Boolean, default: false },
    presentNotification: { type: Boolean, default: false },
    absentNotificationTime: { type: String, enum: ['batch end time', 'after 1 hour', 'end of the day'] },
    notificationType: { type: [String], enum: ['Push Notification', 'SMS', 'Mail', 'WhatsApp', 'Call'] },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
{
  timestamps: true
}
);
  
  module.exports = mongoose.model('ClassSession', classSessionSchema);
  