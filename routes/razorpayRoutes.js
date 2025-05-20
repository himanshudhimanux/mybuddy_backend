const express = require("express");
const router = express.Router();
const razorpayController = require("../controllers/razorpayController");

// 🔹 Razorpay ऑर्डर बनाएँ
router.post("/razorpay/order", razorpayController.createOrder);

// 🔹 Razorpay पेमेंट वेरीफाई करें
router.post("/razorpay/verify", razorpayController.verifyPayment);

module.exports = router;
