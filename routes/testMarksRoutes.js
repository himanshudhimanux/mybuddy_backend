const express = require("express");
const { getMarksByStudentId, createTestMarks, getMarksByStudentAndTestId } = require("../controllers/testMarksController");
const router = express.Router();

// POST - Create marks
router.post("/add-test-marks", createTestMarks);


// GET - Get marks by student ID
router.get("/get-marks/student/:studentId", getMarksByStudentId);


router.get('/test-marks/:studentId/:testId', getMarksByStudentAndTestId);


module.exports = router;
