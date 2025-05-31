const mongoose = require("mongoose");

const sessionYearSchema = new mongoose.Schema({
  startMonth: { type: String, required: true },   // e.g. "March"
  startYear: { type: Number, required: true },    // e.g. 2025
  endYear: { type: Number, required: true },      // e.g. 2027
  sessionTitle: { type: String },                 // e.g. "2025–2027" (auto-generated)
  defaultYear: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('SessionYear', sessionYearSchema);
