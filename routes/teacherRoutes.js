const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { teacherRegister, getAllTeachers, specificTeacher } = require('../controllers/teacherController');
const router = express.Router();

router.post('/teacher', verifyToken, roleCheck('admin'), teacherRegister);
router.get('/teachers', verifyToken, roleCheck('admin'), getAllTeachers);
router.get('/teacher/:id', verifyToken, roleCheck('admin'), specificTeacher);


module.exports = router;
