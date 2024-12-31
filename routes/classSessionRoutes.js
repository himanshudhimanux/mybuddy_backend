const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createClassSession, getClassSessions, updateClassSession, deleteClassSession, searchClassSession, getClassSessionbyId } = require('../controllers/classSessionController');

const router = express.Router();

// Create a new class session
router.post('/class-session', verifyToken, roleCheck('admin'), createClassSession);

// Get all class session
router.get('/class-sessions', verifyToken, roleCheck('admin'), getClassSessions);

// Get all class session by Id
router.get('/class-sessions/:id', verifyToken, roleCheck('admin'), getClassSessionbyId);

// Update a class session
router.put('/class-session/:id', verifyToken, roleCheck('admin'), updateClassSession);

// Delete a class session
router.delete('/class-session/:id', verifyToken, roleCheck('admin'), deleteClassSession);

// Search a class session
router.post('/class-session/search', verifyToken, roleCheck('admin'), searchClassSession);

module.exports = router;
