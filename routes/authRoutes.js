const express = require('express');
const { userRegsiter, userLogin } = require('../controllers/authController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', userRegsiter);
router.post('/login', userLogin);

// Protected routes (example: only admins can access)
router.get('/admin', verifyToken, roleCheck('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
