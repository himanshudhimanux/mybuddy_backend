// models/TestType.js
const mongoose = require('mongoose');

const testTypeSchema = new mongoose.Schema({
  testType: {
    type: String,
    enum: ['Weekly Test', 'Monthly Test', 'Revision Test', 'Surprise Test'],
    required: true,
  },
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  updatedDateTime: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('TestType', testTypeSchema);
