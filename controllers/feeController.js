// FeeController.js
const Student = require('../models/Student');
const CourseStudent = require('../models/CourseStudentSchema');
const Fee = require('../models/FeeSchema');
const FeeHistory = require('../models/FeeHistory');


const generateAutoId = (prefix = '') => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `${prefix}${timestamp}${random}`;
};

exports.submitFee = async (req, res) => {
  const {
    fee_id,
    amount,
    mode_of_payment,
    reference_id,
    transaction_no,
    amount_received_by,
    comment,
  } = req.body;

  try {
    const fee = await Fee.findById(fee_id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // Auto-generate if missing
    const autoReferenceId = reference_id || generateAutoId("REF-");
    const autoTransactionNo = transaction_no || generateAutoId("TXN-");

    // Create FeeHistory
    const history = new FeeHistory({
      fees_id: fee._id,
      amount,
      mode_of_payment,
      reference_id: autoReferenceId,
      transaction_no: autoTransactionNo,
      status: "Paid",
      amount_received_by,
      comment,
      date: new Date(),
    });

    await history.save();

    // Update Fee
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
      .populate({
        path: "course_student_id",
        populate: {
          path: "courseId",      // 👈 This is defined in CourseStudent schema
          model: "Course",       // 👈 Ensure Course model is registered
          select: "name"         // 👈 Only fetch course name
        }
      })
      .populate("created_by", "name")
      .populate("updated_by", "name");

    if (!feeDetails || feeDetails.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No fee records found for this student.",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee details fetched successfully.",
      data: feeDetails
    });

  } catch (error) {
    console.error("Error fetching fee details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching fee details.",
      data: null
    });
  }
};



exports.getStudentFeeHistory = async (req, res) => {

  const { studentId } = req.params;

  try {
    
    // Step 1: Find all fee records for the student
    const fees = await Fee.find({ student_id: studentId }).select("_id");

    if (!fees.length) {
      return res.status(200).json({
        success: false,
        message: "No fee records found for this student",
        history: [],
      });
    }

    const feeIds = fees.map(fee => fee._id);

    // Step 2: Find all FeeHistory records linked to those fee IDs
    const history = await FeeHistory.find({ fees_id: { $in: feeIds } })
      .populate("fees_id")
      .sort({ date: -1 });

    if (!history.length) {
      return res.status(200).json({
        success: false,
        message: "No payment history found for this student",
        history: [],
      });
    }

    // Step 3: Return success response
    res.status(200).json({
      success: true,
      message: "Payment history fetched successfully",
      student_id: studentId,
      history,
    });

  } catch (error) {
    console.error("Error fetching student payment history:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching payment history",
      error: error.message,
    });
  }
};



