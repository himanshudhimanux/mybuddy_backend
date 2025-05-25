const express = require("express");
const { getMarksByStudentId, createTestMarks, getMarksByStudentAndTestId, getStudentsByTestSchedule, getStudentsByCourseAndSubject } = require("../controllers/testMarksController");
const router = express.Router();

// POST - Create marks
router.post("/add-test-marks", createTestMarks);


// GET - Get marks by student ID
router.get("/get-marks/student/:studentId", getMarksByStudentId);


router.get('/test-marks/:studentId/:testId', getMarksByStudentAndTestId);

// router.get('/by-test-schedule/:scheduleId', getStudentsByTestSchedule);


router.get('/by-course-subject/:courseId/:subjectId', getStudentsByCourseAndSubject);


module.exports = router;
