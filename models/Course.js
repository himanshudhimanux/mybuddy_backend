const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

  name: { type: String, required: true },
  courseType: { type: String, enum: ['online', 'offline'], required: true },
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  courseFee: { type: String, required: true },
  
});

module.exports = mongoose.model('Course', courseSchema);
