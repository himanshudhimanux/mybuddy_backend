const express = require('express');
const { userRegsiter, userLogin, loginWithPhone, verifyOtp } = require('../controllers/authController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', userRegsiter);
router.post('/login', userLogin);

router.post("/loginWithPhone", loginWithPhone); // Father phone login
router.post("/verify-otp", verifyOtp); // OTP verification

// Protected routes (example: only admins can access)
router.get('/admin', verifyToken, roleCheck('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
