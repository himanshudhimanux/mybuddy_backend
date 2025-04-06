const express = require('express');
const router = express.Router();
const { createCourseStudent } = require('../controllers/courseStudentController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

// Route to enroll a student in a course
router.post('/add_student_course', verifyToken, roleCheck('admin'), createCourseStudent);

module.exports = router;
