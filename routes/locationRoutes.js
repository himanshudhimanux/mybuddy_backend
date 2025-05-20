const express = require('express');
const { createLocation, getLocations, updateLocation, deleteLocation } = require('../controllers/locationController');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/location', verifyToken, roleCheck('admin'), createLocation);
router.get('/locations', verifyToken, roleCheck('admin'), getLocations);
router.put('/location/:id', verifyToken, roleCheck('admin'), updateLocation);
router.delete('/location/:id', verifyToken, roleCheck('admin'), deleteLocation);

module.exports = router;
