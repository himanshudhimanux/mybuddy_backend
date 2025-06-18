const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    studentId: { type: Number, unique: true, required: true },
    registrationNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, required: true },
    fatherPhone: { type: Number, required: true },
    motherPhone: { type: Number },
    studentPhone: { type: Number },
    dob: { type: Date },
    gender: { type: String, required: true },
    photo: { type: String, default: "https://via.placeholder.com/50" },
    email: { type: String },
}, {
    timestamps: true
});



module.exports = mongoose.model('Student', studentSchema);
