const mongoose = require('mongoose');

const batchStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    studentRollNo: { type: Number, required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    joiningDate: { type: Date, required: true },
    payableFees: { type: Number, required: true },
    totalCourseFees: { type: String,},
    discountComment: { type: String },
    numberOfInstallments: { type: Number, required: true },
    installmenType: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Halfyearly', 'One Time'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Attending', 'Absconding', 'Left', 'Shifted', 'Deleted'],
        default: 'Attending',
    },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [{ type: Object }],
});

module.exports = mongoose.model('BatchStudent', batchStudentSchema);
