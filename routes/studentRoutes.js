const express = require('express');
const { studentRegister, getAllStudent, specificStudent, studentPicUpload, updateStudent, deleteStudent, switchStudentProfile, getStudentsByFatherPhone, getTodayStudentInfo, searchStudentPerformance, getStudentPerformance } = require('../controllers/studentController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/student', studentPicUpload, verifyToken, roleCheck('admin'), studentRegister);

router.get('/students', verifyToken, roleCheck('admin', 'teacher'), getAllStudent);

router.get('/students/:id', verifyToken, roleCheck('admin', 'teacher'), specificStudent);

// Get students by fatherPhone
router.get('/fetch-students', verifyToken, getStudentsByFatherPhone);

// Switch Student Profile
router.post('/switch-profile', verifyToken, switchStudentProfile);

router.put("/:id", studentPicUpload, updateStudent); // Update a specific student

router.delete("/:id", deleteStudent); // Delete a specific student

router.get("/student-today-data/:studentId", verifyToken, getTodayStudentInfo )

// student performance apis

router.get('/student/performance/search', searchStudentPerformance)

router.get('/student/biodata/:studentId', getStudentPerformance);

module.exports = router;
