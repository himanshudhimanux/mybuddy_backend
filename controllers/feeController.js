// FeeController.js
const Student = require('../models/Student');
const CourseStudent = require('../models/CourseStudentSchema');
const Fee = require('../models/FeeSchema');
const FeeHistory = require('../models/FeeHistory');




exports.getStudentFeeDetails = async (req, res) => {
  const query = req.query.query;

  try {
    // search student with naame or registration number
    const student = await Student.findOne({
      $or: [
        { registrationNumber: query },
        { name: { $regex: query, $options: 'i' } }
      ]
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    // find student in course
    const courseStudent = await CourseStudent.findOne({ studentId: student._id });

    if (!courseStudent) return res.status(404).json({ message: "Course not found for student" });

    // get student fee details
    const fee = await Fee.findOne({ course_student_id: courseStudent._id });

    if (!fee) return res.status(404).json({ message: "No fee found for student" });

    res.json({
      student,
      courseStudent,
      fee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Submit Fee by Admin

exports.submitFee = async (req, res) => {
  const {
    fee_id,
    amount,
    mode_of_payment,
    reference_id,
    transaction_no,
    amount_received_by
  } = req.body;

  try {
    const fee = await Fee.findById(fee_id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // FeeHistory create
    const history = new FeeHistory({
      fees_id: fee._id,
      amount,
      mode_of_payment,
      reference_id,
      status: "Paid",
      transaction_no,
      amount_received_by
    });

    await history.save();

    // update fee
    fee.amount_paid += amount;
    fee.amount_pending = fee.amount_to_be_paid - fee.amount_paid;

    if (fee.amount_pending <= 0) {
      fee.status = "Fully-Paid";
      fee.amount_pending = 0;
    } else {
      fee.status = "Partial-Paid";
    }

    fee.update_datetime = new Date();
    await fee.save();

    res.json({ message: "Fee submitted successfully", fee, history });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fee submit failed" });
  }
};
