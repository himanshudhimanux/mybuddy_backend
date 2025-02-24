const FeeHistory = require("../models/FeeHistory");

const createFeeHistory = async (req, res) => {
  try {
    const feeHistory = new FeeHistory(req.body);
    await feeHistory.save();
    res.status(201).json(feeHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeeHistoryByFeeId = async (req, res) => {
  try {
    const history = await FeeHistory.find({ fees_id: req.params.feeId }).populate("fees_id");
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    createFeeHistory,
    getFeeHistoryByFeeId
}
