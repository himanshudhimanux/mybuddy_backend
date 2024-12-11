const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { registerInsitute, getAllInstitutes, specificInstitute } = require('../controllers/instituteController');
const router = express.Router();

router.post('/institute', verifyToken, roleCheck('admin'), registerInsitute);
router.get('/institutes', verifyToken, roleCheck('admin'), getAllInstitutes);
router.get('/institutes/:id', verifyToken, roleCheck('admin'), specificInstitute);


module.exports = router;
