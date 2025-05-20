const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const Fee = require("../models/FeeSchema");
const FeeHistory = require("../models/FeeHistory");

dotenv.config();

// 🔹 Razorpay Instance बनाएं
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Razorpay ऑर्डर बनाएं
exports.createOrder = async (req, res) => {
  try {
    const { studentId, amount } = req.body;

    // छात्र की फीस डिटेल्स प्राप्त करें
    const fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "छात्र की फीस जानकारी नहीं मिली।" });
    }

    const options = {
      amount: amount * 100, // Razorpay पैसे को "पैसे" (INR 1 = 100 paise) में लेता है
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "ऑर्डर बनाने में त्रुटि।", error });
  }
};

// 🔹 Razorpay वेबहुक (Webhook) से पेमेंट वेरीफाई करें
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentId } = req.body;

    // Razorpay Signature वेरीफिकेशन
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "पेमेंट वेरीफिकेशन फेल।" });
    }

    // छात्र की फीस अपडेट करें
    const fee = await Fee.findOne({ student_id: studentId });
    if (!fee) {
      return res.status(404).json({ message: "छात्र की फीस जानकारी नहीं मिली।" });
    }

    // भुगतान को हिस्ट्री में सेव करें
    const payment = new FeeHistory({
      fees_id: fee._id,
      amount: fee.amount_to_be_paid,
      mode_of_payment: "Payment_Gateway",
      reference_id: razorpay_payment_id,
      transaction_no: razorpay_order_id,
      status: "Paid",
    });

    await payment.save();

    // fee update
    fee.amount_paid += fee.amount_to_be_paid;
    fee.amount_pending = 0;
    fee.status = "Fully-Paid";

    await fee.save();

    res.json({ success: true, message: "Payment Successfull", payment, fee });
  } catch (error) {
    res.status(500).json({ message: "Payment Verification Error", error });
  }
};
