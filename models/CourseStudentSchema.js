const mongoose = require('mongoose');
const Fee = require('../models/FeeSchema');


const courseStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentRollNo: { type: Number, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    subjectIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        }
      ],
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


courseStudentSchema.post("save", async function (doc, next) {
    try {
        const existingFee = await Fee.findOne({ course_student_id: doc._id });

        console.log("exsitingFee")

        // if fee exist 
        if (!existingFee) {
            const newFee = new Fee({
                student_id: doc.studentId,
                course_student_id: doc._id,
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


// Create a compound unique index on studentId and course id
courseStudentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseStudent', courseStudentSchema);
