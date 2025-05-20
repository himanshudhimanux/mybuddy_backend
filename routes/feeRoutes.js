const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

// get student fee details
router.get("/get_student_fee", feeController.getStudentFeeDetails);

// new payment add
router.post("/fees/pay", feeController.submitFee);

router.get("/student/fees/:studentId", verifyToken, feeController.getFeeDetailsByStudentId);


// GET: Student payment history
router.get("/fees/history/:studentId", feeController.getStudentFeeHistory);


module.exports = router;
