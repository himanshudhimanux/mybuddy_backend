const express = require("express");
const router = express.Router();
const feeHistoryController = require("../controllers/feeHistoryController");

router.post("/", feeHistoryController.createFeeHistory);
router.get("/:feeId", feeHistoryController.getFeeHistoryByFeeId);

module.exports = router;
