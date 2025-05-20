const express = require('express');
const { studentRegister, getAllStudent, specificStudent, studentPicUpload, updateStudent, deleteStudent, switchStudentProfile, getStudentsByFatherPhone, getTodayStudentInfo } = require('../controllers/studentController');
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


router.get("/student-today-data/:studentId", getTodayStudentInfo )

module.exports = router;
