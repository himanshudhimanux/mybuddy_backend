const { default: mongoose } = require("mongoose");

const FeeHistorySchema = new mongoose.Schema({
    fees_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", required: true },
    amount: { type: Number, required: true },
    mode_of_payment: { 
      type: String, 
      enum: ["Cash", "Payment_Gateway", "Cheque", "NEFT_RTGS", "UPI"], 
      required: true 
    },
    reference_id: { type: String },
    status: { 
      type: String, 
      enum: ["Pending", "Paid", "Cancelled", "Declined", "Failed"], 
      required: true 
    },
    transaction_no: { type: String, unique: true },
    amount_received_by: { type: String, required: function() { return this.mode_of_payment === "Cash"; }},
    create_datetime: { type: Date, default: Date.now },
    update_datetime: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  
  module.exports = mongoose.model("FeeHistory", FeeHistorySchema);
  