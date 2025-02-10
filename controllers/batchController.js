const Batch = require('../models/BatchSchema');
const BatchStudent = require('../models/BatchStudentSchema')

// Create a new batch
const createBatch = async (req, res) => {
  try {
    const { name, sessionYearId, locationId, courseIds } = req.body;

    const newBatch = new Batch({
      name,
      sessionYearId,
      locationId,
      courseIds,
      createdBy: req.user.userId
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
      .populate('sessionYearId', 'yearName') // Populate sessionYearId with yearName
      .populate('locationId', 'name') // Populate locationId with name and address
      .populate('courseIds', 'name'); // Populate courseIds with name

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
      .populate('courseIds', 'name');

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


const getStudentBatches = async (req, res) => {
  try {
      const { studentId } = req.params;

      if (!studentId) {
          return res.status(400).json({ success: false, message: "Student ID is required" });
      }

      // ✅ Find all batch enrollments for the student
      const batchEnrollments = await BatchStudent.find({ studentId })
          .populate({
              path: "batchId",
              populate: { path: "courseIds", select: "name" } // Populate course name
          });

      if (!batchEnrollments.length) {
          return res.status(404).json({ success: false, message: "No batches found for this student" });
      }

      // ✅ Extract batch details
      const batches = batchEnrollments.map(enrollment => enrollment.batchId);

      return res.status(200).json({
          success: true,
          batches,
      });

  } catch (error) {
      console.error("Error fetching student batches:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




module.exports={createBatch, getAllBatches, updateBatch, deleteBatch, getBatchById, getStudentBatches}