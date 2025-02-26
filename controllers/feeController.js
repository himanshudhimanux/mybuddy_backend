const Fee = require("../models/FeeSchema");
const FeeHistory = require("../models/FeeHistory");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("student_id batch_student_id");
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("student_id batch_student_id");
    if (!fee) return res.status(404).json({ message: "Fee not found" });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFee = async (req, res) => {
  try {
    const updatedFee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFee) return res.status(404).json({ message: "Fee not found" });
    res.status(200).json(updatedFee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFee = async (req, res) => {
  try {
    const deletedFee = await Fee.findByIdAndDelete(req.params.id);
    if (!deletedFee) return res.status(404).json({ message: "Fee not found" });
    res.status(200).json({ message: "Fee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Fee Details by Student ID
const getFeeByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("student id", studentId);

    const fees = await Fee.find({ student_id: studentId })
      .populate("student_id batch_student_id created_by updated_by");

    if (!fees || fees.length === 0) {
      return res.status(404).json({ message: "No fee records found for this student" });
    }

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get Fee Payment History by Student ID
const getFeeHistoryByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find fees associated with the student
    const fees = await Fee.find({ student_id: studentId }).select("_id");
    if (!fees.length) {
      return res.status(404).json({ message: "No fee records found for this student" });
    }

    // Get all fee IDs related to the student
    const feeIds = fees.map(fee => fee._id);

    // Find payment history using fee IDs
    const feeHistory = await FeeHistory.find({ fees_id: { $in: feeIds } })
      .populate("fees_id created_by updated_by");

    if (!feeHistory.length) {
      return res.status(404).json({ message: "No payment history found for this student" });
    }

    res.status(200).json({ success: true, data: feeHistory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const generateFeeReceipt = async (req, res) => {
  try {
    const { feeId } = req.params;

    // Fetch fee details
    const fee = await Fee.findById(feeId).populate("student_id batch_student_id");
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // Fetch fee payment history
    const feeHistory = await FeeHistory.find({ fees_id: feeId });

    // Create PDF document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../receipts/fee_receipt_${feeId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add Receipt Header
    doc.fontSize(18).text("Fee Payment Receipt", { align: "center" });
    doc.moveDown(1);

    // Student Details
    doc.fontSize(12).text(`Student Name: ${fee.student_id.name}`);
    doc.text(`Batch: ${fee.batch_student_id.batch_name}`);
    doc.text(`Installment Term: ${fee.installment_term}`);
    doc.text(`Status: ${fee.status}`);
    doc.moveDown(1);

    // Fee Details
    doc.text(`Course Fees: ₹${fee.course_fees}`);
    doc.text(`Amount Paid: ₹${fee.amount_paid}`);
    doc.text(`Amount Pending: ₹${fee.amount_pending}`);
    doc.text(`No. of Installments: ${fee.no_of_installments}`);
    doc.moveDown(1);

    // Payment History
    doc.fontSize(14).text("Payment History", { underline: true });
    feeHistory.forEach((payment, index) => {
      doc.fontSize(12).text(`${index + 1}. Date: ${payment.create_datetime.toISOString().split("T")[0]}`);
      doc.text(`   Mode: ${payment.mode_of_payment}`);
      doc.text(`   Amount: ₹${payment.amount}`);
      doc.text(`   Status: ${payment.status}`);
      doc.moveDown(0.5);
    });

    doc.text("Thank you for your payment!", { align: "center" });
    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `Fee_Receipt_${feeId}.pdf`);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    createFee,
    getAllFees,
    getFeeById,
    updateFee,
    deleteFee,
    generateFeeReceipt,
    getFeeByStudentId,
    getFeeHistoryByStudentId
}
