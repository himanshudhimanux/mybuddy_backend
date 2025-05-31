const CourseBatchMap = require('../models/CourseBatchMap');

// Create multiple mappings for a course
exports.addBatchesToCourse = async (req, res) => {
  try {
    const { courseId, batchIds } = req.body;

    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      return res.status(400).json({ message: 'Batch IDs must be a non-empty array' });
    }

    // Remove duplicates (if any)
    const uniqueBatchIds = [...new Set(batchIds)];

    const existingMappings = await CourseBatchMap.find({ 
      courseId, 
      batchId: { $in: uniqueBatchIds } 
    });

    const existingBatchIds = existingMappings.map(m => m.batchId.toString());

    const newMappings = uniqueBatchIds
      .filter(batchId => !existingBatchIds.includes(batchId))
      .map(batchId => ({ courseId, batchId }));

    await CourseBatchMap.insertMany(newMappings);

    res.status(201).json({ message: 'Batches mapped to course successfully', added: newMappings.length });
  } catch (error) {
    console.error('Error mapping batches to course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all batches for a course
exports.getBatchesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const mappings = await CourseBatchMap.find({ courseId })
      .populate('batchId', 'name startDate endDate'); // customize as needed

    res.status(200).json({ courseId, batches: mappings.map(m => m.batchId) });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: remove a batch from course
exports.removeBatchFromCourse = async (req, res) => {
  try {
    const { courseId, batchId } = req.body;

    const result = await CourseBatchMap.findOneAndDelete({ courseId, batchId });

    if (!result) return res.status(404).json({ message: 'Mapping not found' });

    res.status(200).json({ message: 'Batch removed from course' });
  } catch (error) {
    console.error('Error deleting mapping:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
