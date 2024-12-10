const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: Number, required: true },
  photo: { 
    type: String , 
  },
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);
