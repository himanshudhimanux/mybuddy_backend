const mongoose = require('mongoose');
const Fee = require("../models/FeeSchema"); // Fee model import karein

const batchStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentRollNo: { type: Number, required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    joiningDate: { type: Date, required: true },
    payableFees: { type: Number, required: true },
    totalCourseFees: { type: String },
    discountComment: { type: String },
    numberOfInstallments: { type: Number, required: true },
    installmentType: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Half-yearly', 'One-Time'],
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


batchStudentSchema.post("save", async function (doc, next) {
    try {
        const existingFee = await Fee.findOne({ batch_student_id: doc._id });

        // Agar fee entry already hai to naya add na ho
        if (!existingFee) {
            const newFee = new Fee({
                student_id: doc.studentId,
                batch_student_id: doc._id,
                status: "Not-Paid",
                amount_to_be_paid: doc.payableFees,
                amount_paid: 0,
                amount_pending: doc.payableFees,
                course_fees: doc.totalCourseFees || doc.payableFees,
                no_of_installments: doc.numberOfInstallments,
                installment_term: doc.installmentType,
                created_by: doc.createdBy
            });

            await newFee.save();
            console.log("Fee entry created successfully!");
        }
    } catch (error) {
        console.error("Error creating fee entry:", error);
    }
    next();
});



// Create a compound unique index on studentId and batchId
batchStudentSchema.index({ studentId: 1, batchId: 1 }, { unique: true });

module.exports = mongoose.model('BatchStudent', batchStudentSchema);
