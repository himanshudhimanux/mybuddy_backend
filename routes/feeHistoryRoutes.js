const express = require("express");
const router = express.Router();
const feeHistoryController = require("../controllers/feeHistoryController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, feeHistoryController.createFeeHistory);
router.get("/fee-history/:feeId", verifyToken, feeHistoryController.getFeeHistoryByFeeId);

module.exports = router;
