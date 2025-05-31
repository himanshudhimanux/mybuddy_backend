// models/BatchSchema.js

const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sessionYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'SessionYear', required: true },
  locationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true }],
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  history: [{ type: Object }]
},
{
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);
