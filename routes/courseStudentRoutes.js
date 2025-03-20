const express = require('express');
const router = express.Router();
const courseStudentController = require('../controllers/courseStudentController');

// Route to enroll a student in a course
router.post('/enroll', courseStudentController.enrollStudent);

// Route to get all students enrolled in a course
router.get('/course/:courseId', courseStudentController.getEnrolledStudents);

// Route to remove a student from a course
router.delete('/unenroll/:enrollmentId', courseStudentController.removeStudent);

module.exports = router;
