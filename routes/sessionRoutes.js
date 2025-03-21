const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSessionById, updateSession, deleteSession, getSessionsByType, getStudentSessionsAndAttendance, getUpcomingSessions } = require('../controllers/sessionController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

// Create session
router.post('/create-session', verifyToken, roleCheck('admin'), createSession);
router.get("/sessions", verifyToken, roleCheck('admin'),  getSessions);
router.get("/sessions/:id", verifyToken, roleCheck('admin'), getSessionById);
router.put("/sessions/:id",  verifyToken, roleCheck('admin'), updateSession);
router.delete("/sessions/:id", verifyToken, roleCheck('admin'), deleteSession);
router.get("/sessions/type/:type", verifyToken, roleCheck('admin'), getSessionsByType);

// Get sessions and attendance for a student
router.get('/sessions-attendance/:id', verifyToken, getStudentSessionsAndAttendance);

router.get("/upcoming-classess", verifyToken,  getUpcomingSessions);

module.exports = router;
