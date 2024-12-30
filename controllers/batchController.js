const Batch = require('../models/BatchSchema');

// Create a new batch
const createBatch = async (req, res) => {
  try {
    const { name, sessionYearId, locationId, courseIds, createdBy } = req.body;

    const newBatch = new Batch({
      name,
      sessionYearId,
      locationId,
      courseIds,
      createdBy
    });

    await newBatch.save();

    res.status(201).json({
      message: 'Batch created successfully',
      batch: newBatch
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating batch',
      error: error.message
    });
  }
};

// Get all batches
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('sessionYearId')
      .populate('locationId')
      .populate('courseIds');

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching batches',
      error: error.message
    });
  }
};

// Get a single batch by ID
const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id)
      .populate('sessionYearId')
      .populate('locationId')
      .populate('courseIds');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching batch',
      error: error.message
    });
  }
};

// Update a batch
const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Maintain change history
    batch.history.push({
      updatedBy: updates.updatedBy,
      updatedDate: new Date(),
      changes: updates
    });

    Object.assign(batch, updates);
    batch.updatedDate = new Date();

    await batch.save();

    res.status(200).json({
      message: 'Batch updated successfully',
      batch
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating batch',
      error: error.message
    });
  }
};

// Delete a batch
const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Soft delete by adding to history and updating the status
    batch.history.push({
      deletedBy: req.body.deletedBy,
      deletedDate: new Date(),
      changes: { status: 'Deleted' }
    });

    batch.updatedDate = new Date();
    await batch.save();

    res.status(200).json({
      message: 'Batch deleted successfully',
      batch
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting batch',
      error: error.message
    });
  }
};


module.exports={createBatch, getAllBatches, updateBatch, deleteBatch}