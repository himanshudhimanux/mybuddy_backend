const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    registrationNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, required: true },
    fatherPhone: { type: Number, required: true },
    motherPhone: { type: Number },
    studentPhone: { type: Number },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    photo: { type: String , default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    email: { type: String },
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Student', studentSchema);
