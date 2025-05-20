const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { createBatchStudent, getBatchStudents, updateBatchStudent, deleteBatchStudent, getBatchStudentById } = require('../controllers/batchStudentController');

const router = express.Router();

// Create a new batch Student
router.post('/batch-student', verifyToken, roleCheck('admin'), createBatchStudent);

// Get all batches
router.get('/batch-students', verifyToken, roleCheck('admin'), getBatchStudents);

// Get all batch student by id
router.get('/batch-students', verifyToken, roleCheck('admin'), getBatchStudentById);
 
// Update a batch Student
router.put('/update-batch-student/:id', verifyToken, roleCheck('admin'), updateBatchStudent);

// Delete a batch Student
router.delete('/delete-batch-student/:id', verifyToken, roleCheck('admin'), deleteBatchStudent);

module.exports = router;
