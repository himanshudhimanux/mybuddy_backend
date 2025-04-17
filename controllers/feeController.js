// FeeController.js
const Student = require('../models/Student');
const CourseStudent = require('../models/CourseStudentSchema');
const Fee = require('../models/FeeSchema');
const FeeHistory = require('../models/FeeHistory');


exports.getStudentFeeDetails = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      return res.status(400).json({ message: "Missing query parameter" });
    }

    // Try to find the student by reg number or name
    const student = await Student.findOne({
      $or: [
        { registrationNumber: query },
        { name: { $regex: new RegExp(query, "i") } },
      ],
    });

    console.log("student found", student)

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Now find course-student entry
    const courseStudent = await CourseStudent.findOne({
      studentId: student._id,
    }).populate("courseId");

    console.log("student course in found", courseStudent)

    if (!courseStudent) {
      return res.status(404).json({ message: "Course data not found for student" });
    }

    // Get the fee details
    const fee = await Fee.find({ course_student_id: courseStudent._id });

    console.log("student fee found", fee)

    return res.status(200).json({
      student,
      courseStudent,
      fee,
    });

  } catch (err) {
    console.error("Error in getStudentFeeDetails:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getFeeDetailsByStudentId = async (req, res) => {
  
  const { studentId } = req.params;

  try {
    const feeDetails = await Fee.find({ student_id: studentId })
      .populate("student_id", "name email")
      .populate("course_student_id")
      .populate("created_by", "name")
      .populate("updated_by", "name");

    if (!feeDetails || feeDetails.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No fee records found for this student.",
      });
    }

    res.status(200).json({
      success: true,
      data: feeDetails,
    });
  } catch (error) {
    console.error("Error fetching fee details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching fee details.",
    });
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
    amount_received_by,
    comment,
    date
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
      amount_received_by,
      comment,
      date,
    });

    await history.save();

    // Update fee record
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

