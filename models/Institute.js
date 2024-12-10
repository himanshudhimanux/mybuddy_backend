const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // URL for the logo
  contact: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
},{
    timestamps: true
});

module.exports = mongoose.model('Institute', instituteSchema);
