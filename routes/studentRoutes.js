const express = require('express');
const { studentRegister, getAllStudent, specificStudent, studentPicUpload, updateStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/student', studentPicUpload, verifyToken, roleCheck('admin'), studentRegister);
router.get('/students', verifyToken, roleCheck('admin', 'teacher'), getAllStudent);
router.get('/students/:id', verifyToken, roleCheck('admin', 'teacher'), specificStudent);
router.put("/:id", studentPicUpload, updateStudent); // Update a specific student
router.delete("/:id", deleteStudent); // Delete a specific student


module.exports = router;
