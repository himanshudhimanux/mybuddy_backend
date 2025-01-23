const { default: mongoose } = require("mongoose");

const TestScheduleSchema = new mongoose.Schema({
    test_date: { type: Date, required: true },
    test_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "TestType", required: true },
    batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    syllabus: { type: String },
    comment: { type: String },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: { type: String, enum: ["Active", "Cancelled", "Inactive"], required: true },
    max_marks: { type: Number, required: true },
    min_marks: { type: Number, required: true },
    create_datetime: { type: Date, default: Date.now },
    update_datetime: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  
  module.exports = mongoose.model("TestSchedule", TestScheduleSchema);
  