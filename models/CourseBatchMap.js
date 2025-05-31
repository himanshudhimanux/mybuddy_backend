const mongoose = require('mongoose');

const courseBatchMapSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourseBatchMap', courseBatchMapSchema);
