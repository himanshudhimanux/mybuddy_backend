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
} = require('../controllers/testScheduleController');


// Create a new TestSchedule
router.post('/create-test-schedule', createTestSchedule);


// Get all TestSchedules
router.get('/get-test-schedules', getAllTestSchedules);


// Get a specific TestSchedule by ID
router.get('/single-test-schedule/:id', getTestScheduleById);

router.get('/upcoming-tests', getUpcomingTests)

// Update a TestSchedule by ID
router.put('/update-test-schedule/:id', updateTestSchedule);


// Delete a TestSchedule by ID
router.delete('/delete-schedule:id', deleteTestSchedule);





module.exports = router;
