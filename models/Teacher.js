const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
  photo: { type: String , default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);
