const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.post("/", feeController.createFee);
router.get("/", feeController.getAllFees);
router.get("/:id", feeController.getFeeById);
router.put("/:id", feeController.updateFee);
router.delete("/:id", feeController.deleteFee);
router.get("/receipt/:feeId", feeController.generateFeeReceipt);

// ✅ Get Fee Details by Student ID
router.get("/student/:studentId", feeController.getFeeByStudentId);

// ✅ Get Fee Payment History by Student ID
router.get("/history/:studentId", feeController.getFeeHistoryByStudentId);

module.exports = router;
