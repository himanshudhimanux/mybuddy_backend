const express = require('express');
const { createBatch, getAllBatches, updateBatch, deleteBatch } = require('../controllers/batchController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new batch
router.post('/create_batch', verifyToken, roleCheck('admin'), createBatch);

// Get all batches
router.get('/batches', verifyToken, roleCheck('admin'), getAllBatches);

// Update a batch
router.put('/update_batch:id', verifyToken, roleCheck('admin'), updateBatch);

// Delete a batch
router.delete('/delete_batch:id', verifyToken, roleCheck('admin'), deleteBatch);

module.exports = router;
