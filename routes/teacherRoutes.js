const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { teacherRegister, getAllTeachers, specificTeacher, upload } = require('../controllers/teacherController');
const router = express.Router();

router.post('/teacher', upload.single("photo"), verifyToken, roleCheck('admin'), teacherRegister);
router.get('/teachers', verifyToken, roleCheck('admin'), getAllTeachers);
router.get('/teacher/:id', verifyToken, roleCheck('admin'), specificTeacher);




module.exports = router;
