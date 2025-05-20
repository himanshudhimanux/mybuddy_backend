// routes/testTypeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTestType,
  getAllTestTypes,
  getTestTypeById,
  updateTestType,
  deleteTestType,
} = require('../controllers/testTypeController');

// Create a new TestType
router.post('/create-test-type', createTestType);

// Get all TestTypes
router.get('/get-test-types', getAllTestTypes);

// Get a specific TestType by ID
router.get('/get-test-type/:id', getTestTypeById);

// Update a TestType by ID
router.put('/update-test-type/:id', updateTestType);

// Delete a TestType by ID
router.delete('/delete-test-type/:id', deleteTestType);

module.exports = router;
