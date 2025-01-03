const Location = require('../models/Location');

// Create Location
const createLocation = async (req, res) => {
  try {
    const { name, instituteId } = req.body;
    const location = new Location({ name, instituteId, createdBy: req.user.userId, });
    await location.save();
    res.status(201).json({ message: 'Location created successfully', location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Locations
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate('instituteId');
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const location = await Location.findByIdAndUpdate(id, updatedData, { new: true });
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location updated successfully', location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports={createLocation, getLocations, updateLocation, deleteLocation}
