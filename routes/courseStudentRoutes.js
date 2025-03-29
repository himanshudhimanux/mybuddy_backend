const express = require('express');
const router = express.Router();
const courseStudentController = require('../controllers/courseStudentController');

// Route to enroll a student in a course
router.post('/add_student_course', courseStudentController.createCourseStudent);

module.exports = router;
