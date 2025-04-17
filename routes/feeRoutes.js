const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

// get student fee details
router.get("/get_student_fee", feeController.getStudentFeeDetails);

// new payment add
router.post("/fees/pay", feeController.submitFee);


router.get("/student/fees/:studentId", feeController.getFeeDetailsByStudentId);

module.exports = router;
