const Fee = require("../models/FeeSchema");
const FeeHistory = require("../models/FeeHistory");

// 🔹 छात्र की फीस डिटेल्स प्राप्त करें
exports.getStudentFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const fee = await Fee.findOne({ student_id: studentId });

    if (!fee) {
      return res.status(404).json({ message: "फीस डिटेल्स नहीं मिली।" });
    }

    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: "कुछ गलत हुआ।", error });
  }
};

// 🔹 नए भुगतान को प्रोसेस करें
exports.processPayment = async (req, res) => {
  try {
    const { studentId, amount, mode_of_payment, reference_id, transaction_no } = req.body;

    // छात्र की फीस डिटेल्स प्राप्त करें
    let fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "छात्र की फीस जानकारी नहीं मिली।" });
    }

    // नया भुगतान रिकॉर्ड बनाएं
    const payment = new FeeHistory({
      fees_id: fee._id,
      amount,
      mode_of_payment,
      reference_id,
      transaction_no,
      status: "Paid",
    });

    await payment.save();

    // फीस अपडेट करें
    fee.amount_paid += amount;
    fee.amount_pending = fee.amount_to_be_paid - fee.amount_paid;
    fee.status = fee.amount_paid >= fee.amount_to_be_paid ? "Fully-Paid" : "Partial-Paid";

    await fee.save();

    res.json({ message: "भुगतान सफल रहा!", payment, fee });
  } catch (error) {
    res.status(500).json({ message: "भुगतान प्रक्रिया में त्रुटि।", error });
  }
};

// 🔹 छात्र का पूरा भुगतान इतिहास देखें
exports.getPaymentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // छात्र की फीस ढूंढें
    const fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "फीस रिकॉर्ड नहीं मिला।" });
    }

    // भुगतान इतिहास प्राप्त करें
    const payments = await FeeHistory.find({ fees_id: fee._id });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "भुगतान इतिहास प्राप्त करने में त्रुटि।", error });
  }
};
