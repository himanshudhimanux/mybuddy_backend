const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.post("/create-fee", feeController.createFee);
router.get("/allFees", feeController.getAllFees);
router.get("/fee/:id", feeController.getFeeById);
router.put("/fee/:id", feeController.updateFee);
router.delete("/fee/:id", feeController.deleteFee);
router.get("/receipt/:feeId", feeController.generateFeeReceipt);

// ✅ Get Fee Details by Student ID
router.get("/student/:studentId", feeController.getFeeByStudentId);

// ✅ Get Fee Payment History by Student ID
router.get("/history/:studentId", feeController.getFeeHistoryByStudentId);

module.exports = router;
