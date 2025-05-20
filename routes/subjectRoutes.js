const express = require('express');
const { createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_subject', verifyToken, roleCheck('admin'), createSubject);
router.get('/subjects', verifyToken, roleCheck('admin'), getSubjects);
router.put('/update_subject/:id', verifyToken, roleCheck('admin'), updateSubject);
router.delete('/delete_subject/:id', verifyToken, roleCheck('admin'), deleteSubject);

module.exports = router;
