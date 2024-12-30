const mongoose = require("mongoose");

const sessionYearSchema = new mongoose.Schema({
    yearName: { type: String, required: true },
    defaultYear: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  
  module.exports = mongoose.model('SessionYear', sessionYearSchema);
  