const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSessionById, updateSession, deleteSession, getSessionsByType } = require('../controllers/sessionController');

// Create session
router.post('/sessions', createSession);
router.get("/sessions", getSessions);
router.get("/sessions/:id", getSessionById);
router.put("/sessions/:id", updateSession);
router.delete("/sessions/:id", deleteSession);
router.get("/sessions/type/:type", getSessionsByType);

module.exports = router;
