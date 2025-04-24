const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  attendanceDate: { 
    type: Date, 
    required: true 
  },
  attendanceTime: { 
    type: String,  // You can use String or Number (time in hours and minutes, e.g., 14:30)
    required: true 
  },
  attendanceSource: {
    type: String,
    enum: ['Face', 'Manual_using_portal', 'RF_Id_Card'],
    required: true
  },
  attendanceType: {
    type: String,
    enum: ['Present', 'Absent', "Leave"],
    required: true
  },
  notificationSent: { 
    type: [String], 
    enum: ['Push Notification', 'SMS', 'Mail', 'WhatsApp', 'Call'] 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
},{
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
