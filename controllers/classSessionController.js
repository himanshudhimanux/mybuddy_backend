const ClassSession = require('../models/ClassSessionSchema');
const Batch = require('../models/BatchSchema')

const createClassSession = async (req, res) => {
  try {
    const sessionData = req.body;

    // If no startTime or endTime provided, fetch from batch
    if (!sessionData.startTime || !sessionData.endTime) {
      const batch = await Batch.findById(sessionData.batchId);
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
      sessionData.startTime = sessionData.startTime || batch.defaultStartTime;
      sessionData.endTime = sessionData.endTime || batch.defaultEndTime;
    }

    const session = new ClassSession({
      ...sessionData,
      createdBy: req.user ? req.user._id : null, // Optional user linking
    });

    await session.save();
    res.status(201).json({ success: true, message: 'Class session created', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClassSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sessionType, sessionMode, batchId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (sessionType) filters.sessionType = sessionType;
    if (sessionMode) filters.sessionMode = sessionMode;
    if (batchId) filters.batchId = batchId;

    const skip = (page - 1) * limit;

    const sessions = await ClassSession.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('batchId subjectId teacherId'); // Populate references

    const total = await ClassSession.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: sessions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClassSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await ClassSession.findById(id).populate('batchId subjectId teacherId');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateClassSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const session = await ClassSession.findByIdAndUpdate(id, updatedData, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json({ success: true, message: 'Class session updated', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteClassSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await ClassSession.findById(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'Cancelled'; // Soft delete by updating status
    await session.save();

    res.status(200).json({ success: true, message: 'Class session cancelled', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports={
createClassSession,
getClassSessions,
getClassSessionById,
updateClassSession,
deleteClassSession
}