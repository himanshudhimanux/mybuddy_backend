const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({

  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course_student_id: { type: mongoose.Schema.Types.ObjectId, ref: "CourseStudent", required: true },
  status: { type: String, enum: ["Not-Paid", "Partial-Paid", "Fully-Paid", "Forcefully-Settled"], required: true },
  amount_to_be_paid: { type: Number, required: true },
  amount_paid: { type: Number, default: 0 },
  amount_pending: { type: Number, required: true },
  course_fees: { type: Number, required: true },
  no_of_installments: { type: Number, required: true },
  installment_term: { 
    type: String, 
    enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"], 
    required: true 
  },
  create_datetime: { type: Date, default: Date.now },
  update_datetime: { type: Date },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
});

module.exports = mongoose.model("Fee", FeeSchema);
