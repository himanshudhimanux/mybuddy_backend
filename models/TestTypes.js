const { default: mongoose } = require("mongoose");

const TestTypeSchema = new mongoose.Schema({
    test_type: { type: String, required: true, unique: true },
    create_datetime: { type: Date, default: Date.now },
    update_datetime: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  
  module.exports = mongoose.model("TestType", TestTypeSchema);
  