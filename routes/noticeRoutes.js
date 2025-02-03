const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createNotice, getAllNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');

const router = express.Router();

router.post('/create_notice', verifyToken, roleCheck('admin'), createNotice);
router.get('/notices', verifyToken, getAllNotice);
router.put('/update_notice/:id', verifyToken, roleCheck('admin'), updateNotice);
router.delete('/delete_notice/:id', verifyToken, roleCheck('admin'), deleteNotice);

module.exports = router;
