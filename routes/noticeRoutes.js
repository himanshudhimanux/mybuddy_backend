const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createNotice, getAllNotice, updateNotice, deleteNotice, singleNotice, upload } = require('../controllers/noticeController');


const router = express.Router();

router.post('/create_notice', upload.single('notice_img'), verifyToken, roleCheck('admin'), createNotice);
router.get('/notices', verifyToken, getAllNotice);
router.put('/update_notice/:id', verifyToken, roleCheck('admin'), updateNotice);
router.delete('/delete_notice/:id', verifyToken, roleCheck('admin'), deleteNotice);

router.get('/single_notice/:id', verifyToken, roleCheck('admin'), singleNotice);

module.exports = router;
