const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseType: { type: String, enum: ['online', 'offline'], required: true },
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  courseFee: { type: String, required: true },

  sessionYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionYear',
    required: true,
  },

  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
