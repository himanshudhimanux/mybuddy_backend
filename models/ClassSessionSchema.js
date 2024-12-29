const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    batchDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Active', 'Holidays - Calendar', 'Holidays - Batch', 'Cancelled'],
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
    startTime: { type: String },
    endTime: { type: String },
    absenteeNotification: { type: Boolean, default: false },
    presentNotification: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [{ type: Object }]
  });
  
  module.exports = mongoose.model('ClassSession', classSessionSchema);
  