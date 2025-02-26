const { default: mongoose } = require("mongoose");
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
    console.log("Request Params:", req.params);
    
    const { feeId } = req.params;
    console.log("feeId from request:", feeId);

    if (!feeId) {
      return res.status(400).json({ error: "feeId is missing in request" });
    }

    // Convert feeId to ObjectId
    const objectFeeId = new mongoose.Types.ObjectId(feeId);

    // Fetch fee history based on fees_id
    const history = await FeeHistory.find({ fees_id: objectFeeId });

    if (!history || history.length === 0) {
      return res.status(404).json({ error: "No fee history found for this feeId" });
    }

    res.json(history);
  } catch (error) {
    console.error("Error fetching fee history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getFeeHistoryByFeeId };


module.exports={
    createFeeHistory,
    getFeeHistoryByFeeId
}
