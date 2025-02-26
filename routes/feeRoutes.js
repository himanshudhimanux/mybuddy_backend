const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

router.post("/create-fee", verifyToken, feeController.createFee);
router.get("/allFees", verifyToken,  feeController.getAllFees);
router.get("/fee/:id", verifyToken, feeController.getFeeById);
router.put("/fee/:id", verifyToken, feeController.updateFee);
router.delete("/fee/:id", verifyToken, feeController.deleteFee);
router.get("/receipt/:feeId", verifyToken, feeController.generateFeeReceipt);


// ✅ Get Fee Details by Student ID
router.get("/student/:id", verifyToken, feeController.getFeeByStudentId);

// ✅ Get Fee Payment History by Student ID
router.get("/fee/history/student/:id", verifyToken, feeController.getFeeHistoryByStudentId);

module.exports = router;
