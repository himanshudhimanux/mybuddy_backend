const express = require('express');
const { createSessionYear, getSessionYears, updateSessionYear, deleteSessionYear } = require('../controllers/sessionYearController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-session-year', verifyToken, roleCheck('admin'), createSessionYear);
router.get('/session-years', verifyToken, roleCheck('admin'), getSessionYears);
router.put('/update-session-year/:id', verifyToken, roleCheck('admin'), updateSessionYear);
router.delete('/delete-session-year/:id', verifyToken, roleCheck('admin'), deleteSessionYear);

module.exports = router;
