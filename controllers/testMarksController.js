const TestMarks = require("../models/TestMarks");

// Create test marks
exports.createTestMarks = async (req, res) => {
  try {
    const { test_id, student_id, marks_obtained, result, status } = req.body;

    const newMark = await TestMarks.create({
      test_id,
      student_id,
      marks_obtained,
      result,
      status,
    });

    res.status(201).json({ success: true, message: "Test mark created", data: newMark });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating test mark", error: error.message });
  }
};

// Get test marks by student ID
exports.getMarksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const marks = await TestMarks.find({ student_id: studentId })
      .populate("test_id")
      .populate("student_id");

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching marks", error: error.message });
  }
};
