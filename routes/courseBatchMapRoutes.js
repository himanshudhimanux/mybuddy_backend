const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseBatchMapController');

// POST: Add multiple batches to a course
router.post('/add-batches', controller.addBatchesToCourse);

// GET: Get all batches of a course
router.get('/batchebycourse/:courseId/batches', controller.getBatchesByCourseId);

// DELETE: Remove one batch from course
router.delete('/remove-batch', controller.removeBatchFromCourse);

module.exports = router;
