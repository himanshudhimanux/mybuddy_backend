const express = require("express");
const { getMarksByStudentId, createTestMarks } = require("../controllers/testMarksController");
const router = express.Router();

// POST - Create marks
router.post("/add-test-marks", createTestMarks);


// GET - Get marks by student ID
router.get("/get-marks/student/:studentId", getMarksByStudentId);

module.exports = router;
