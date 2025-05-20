const { default: mongoose } = require("mongoose");

const TestMarksSchema = new mongoose .Schema({
    test_id: { type: mongoose.Schema.Types.ObjectId, ref: "TestSchedule", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    marks_obtained: { type: Number, required: true },
    result: { type: String, enum: ["Pass", "Failed"], required: true },
    status: { 
      type: String, 
      enum: ["Appeared", "Absent", "Not Taken", "Absconding"], 
      required: true 
    },
  });
  
  module.exports = mongoose.model("TestMarks", TestMarksSchema);
  