const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

// 🔹 छात्र की फीस डिटेल्स प्राप्त करें
router.get("/fees/:studentId", feeController.getStudentFeeDetails);

// 🔹 नया भुगतान करें
router.post("/fees/pay", feeController.processPayment);

// 🔹 छात्र का भुगतान इतिहास देखें
router.get("/fees/history/:studentId", feeController.getPaymentHistory);

module.exports = router;
