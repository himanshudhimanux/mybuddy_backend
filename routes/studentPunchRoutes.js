const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createStudentPunch, getTodayPunchTimes } = require('../controllers/studentPunchController');


const router = express.Router();


router.get('/student/:studentId/punch-today', verifyToken, getTodayPunchTimes);


router.post('/student/:studentId/punch', verifyToken, createStudentPunch);


module.exports = router;
