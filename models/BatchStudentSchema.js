const mongoose = require('mongoose')

const batchStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentRollNo: { type: String },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    status: {
      type: String,
      enum: ['Attending', 'Absconding', 'Left', 'Shifted', 'Deleted'],
      default: 'Attending'
    },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [{ type: Object }]
  });
  
  module.exports = mongoose.model('BatchStudent', batchStudentSchema);
  