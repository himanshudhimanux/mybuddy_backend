const express = require('express');
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_course', verifyToken, roleCheck('admin'), createCourse);
router.get('/courses', verifyToken, roleCheck('admin'), getCourses);
router.put('/update_course/:id', verifyToken, roleCheck('admin'), updateCourse);
router.delete('/delete_course/:id', verifyToken, roleCheck('admin'), deleteCourse);

module.exports = router;
