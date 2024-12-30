const express = require('express');
const { createSessionYear, getSessionYears, updateSessionYear, deleteSessionYear } = require('../controllers/sessionYearController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_session_year', verifyToken, roleCheck('admin'), createSessionYear);
router.get('/session_years', verifyToken, roleCheck('admin'), getSessionYears);
router.put('/update_session_year/:id', verifyToken, roleCheck('admin'), updateSessionYear);
router.delete('/delete_session_year/:id', verifyToken, roleCheck('admin'), deleteSessionYear);

module.exports = router;
