const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createAttendance, getAttendanceRecords, getAttendanceById, updateAttendance, deleteAttendance, getEligibleStudents, getAttendanceSummary, getAttendanceByStudentId } = require('../controllers/attendanceController');


const router = express.Router();

router.get('/attendance-history/:studentId', getAttendanceByStudentId);

// Create or mark attendance
router.post('/attendance', verifyToken, roleCheck('admin'), createAttendance);

// Get all records of attendance
router.get('/attendance-records', verifyToken, roleCheck('admin'), getAttendanceRecords);

// Get all attendance record by id
router.get('/single-attendance', verifyToken, roleCheck('admin'), getAttendanceById);
 
// Update a attendance
router.put('/update-attendance/:id', verifyToken, roleCheck('admin'), updateAttendance);

// Delete a attendance
router.delete('/delete-update/:id', verifyToken, roleCheck('admin'), deleteAttendance);

//Get eligible Stduent
router.get('/sessions/:sessionId/eligible-students', getEligibleStudents);

// student monthly or weekly attendance
router.get('/attendance/summary/:studentId', getAttendanceSummary);

module.exports = router;
