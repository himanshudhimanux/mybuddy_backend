// routes/testScheduleRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTestSchedule,
  getAllTestSchedules,
  getTestScheduleById,
  updateTestSchedule,
  deleteTestSchedule,
  getUpcomingTests,
  getPastTests,
} = require('../controllers/testScheduleController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');


// Create a new TestSchedule
router.post('/create-test-schedule', verifyToken, createTestSchedule);


// Get all TestSchedules
router.get('/get-test-schedules', verifyToken,  getAllTestSchedules);


// Get a specific TestSchedule by ID
router.get('/single-test-schedule/:id', verifyToken, getTestScheduleById);

router.get('/upcoming-tests', verifyToken, getUpcomingTests)


router.get('/test/past', verifyToken, getPastTests)


// Update a TestSchedule by ID
router.put('/update-test-schedule/:id', verifyToken, updateTestSchedule);


// Delete a TestSchedule by ID
router.delete('/delete-schedule:id', verifyToken, deleteTestSchedule);





module.exports = router;
