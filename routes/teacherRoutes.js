const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { teacherRegister, getAllTeachers, specificTeacher, upload, deleteTeacher, updateTeacher } = require('../controllers/teacherController');
const router = express.Router();

router.post('/teacher', upload.single("photo"), verifyToken, roleCheck('admin'), teacherRegister);

router.get('/teachers', verifyToken, roleCheck('admin'), getAllTeachers);

router.put('/update/teacher/:id', verifyToken, roleCheck('admin'), updateTeacher);

router.delete('/delete/teacher/:id', verifyToken, roleCheck('admin'), deleteTeacher);

router.get('/teacher/:id', verifyToken, roleCheck('admin'), specificTeacher);




module.exports = router;
