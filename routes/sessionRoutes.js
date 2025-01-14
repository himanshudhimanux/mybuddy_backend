const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSessionById, updateSession, deleteSession, getSessionsByType } = require('../controllers/sessionController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

// Create session
router.post('/sessions', verifyToken, roleCheck('admin'), createSession);
router.get("/sessions", verifyToken, roleCheck('admin'),  getSessions);
router.get("/sessions/:id", verifyToken, roleCheck('admin'), getSessionById);
router.put("/sessions/:id",  updateSession);
router.delete("/sessions/:id", verifyToken, roleCheck('admin'), deleteSession);
router.get("/sessions/type/:type", verifyToken, roleCheck('admin'), getSessionsByType);

module.exports = router;
