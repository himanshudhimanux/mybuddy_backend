const Fee = require("../models/FeeSchema");
const FeeHistory = require("../models/FeeHistory");


exports.getStudentActiveFees = async (req, res) => {
  try {
      const { studentId } = req.params;

      console.log("studentId", studentId);

      if (!studentId) {
          return res.status(400).json({ error: "Student ID is required" });
      }

      // Fetch student's active fees with batch details
      const fees = await Fee.find({
          student_id: studentId,
          status: { $in: ["Not-Paid", "Partial-Paid"] }
      })
      .populate({
          path: "batch_student_id",
          populate: { path: "batchId", select: "name" } // Fetch only the batch name
      });

      res.status(200).json({ success: true, fees });
  } catch (error) {
      console.error("Error fetching student fees:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 student all fee details
exports.getStudentFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const fee = await Fee.findOne({ student_id: studentId });

    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong", error });
  }
};

// 🔹 New payment process
exports.processPayment = async (req, res) => {
  try {
    const { studentId, amount, mode_of_payment, reference_id, transaction_no } = req.body;

    // get student fee
    let fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "student fee not found" });
    }

    // New payment save
    const payment = new FeeHistory({
      fees_id: fee._id,
      amount,
      mode_of_payment,
      reference_id,
      transaction_no,
      status: "Paid",
    });

    await payment.save();

    // update fee
    fee.amount_paid += amount;
    fee.amount_pending = fee.amount_to_be_paid - fee.amount_paid;
    fee.status = fee.amount_paid >= fee.amount_to_be_paid ? "Fully-Paid" : "Partial-Paid";

    await fee.save();

    res.json({ message: "Payment Sucessfull", payment, fee });
  } catch (error) {
    res.status(500).json({ message: "Payment Error", error });
  }
};

// 🔹 Student payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student feee
    const fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // get payment history
    const payments = await FeeHistory.find({ fees_id: fee._id });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Payment History Error", error });
  }
};
