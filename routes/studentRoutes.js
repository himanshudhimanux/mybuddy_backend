const express = require('express');
const { studentRegister, getAllStudent, specificStudent } = require('../controllers/studentController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/student', verifyToken, roleCheck('admin'), studentRegister);
router.get('/students', verifyToken, roleCheck('admin', 'teacher'), getAllStudent);
router.get('/students/:id', verifyToken, roleCheck('admin', 'teacher'), specificStudent);


module.exports = router;