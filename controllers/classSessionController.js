const Batch = require('../models/BatchSchema');
const ClassSession = require('../models/ClassSessionSchema');

// Post Create Class Session

const createClassSession = async (req, res) => {
    try {
      const { batchId, batchDate, status, sessionType, sessionMode, batchStartTiming, batchEndTiming, absenteesNotification, presentNotification, createdBy } = req.body;
  
      // बैच से डिफॉल्ट टाइमिंग लाना
      const batch = await Batch.findById(batchId);
      if (!batch) return res.status(404).send({ message: 'Batch not found' });
  
      const session = new ClassSession({
        batchId,
        batchDate,
        status,
        sessionType,
        sessionMode,
        batchStartTiming: batchStartTiming || batch.startTiming, // बैच का डिफॉल्ट टाइमिंग या यूजर की टाइमिंग
        batchEndTiming: batchEndTiming || batch.endTiming,
        absenteesNotification,
        presentNotification,
        createdBy,
      });
  
      await session.save();
      res.status(201).send({ message: 'Session created successfully', session });
    } catch (error) {
      res.status(500).send({ message: 'Error creating session', error });
    }
  };

// get Batch Class Session  
const getClassSessions =  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, sessionType, sessionMode, batchId } = req.query;
  
      // Query filters
      const filters = {};
      if (status) filters.status = status;
      if (sessionType) filters.sessionType = sessionType;
      if (sessionMode) filters.sessionMode = sessionMode;
      if (batchId) filters.batchId = batchId;
  
      // Pagination logic
      const skip = (page - 1) * limit;
  
      // Fetch data
      const sessions = await ClassSession.find(filters).skip(skip).limit(parseInt(limit));
      const total = await ClassSession.countDocuments(filters);
  
      res.status(200).send({
        message: 'Sessions fetched successfully',
        data: sessions,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      res.status(500).send({ message: 'Error fetching sessions', error });
    }
  };
  

// == Get Class Session by Id  

const getClassSessionbyId =  async (req, res) => {
    try {
      const { id } = req.params;
  
      const session = await Session.findById(id);
      if (!session) return res.status(404).send({ message: 'Session not found' });
  
      res.status(200).send({ message: 'Session fetched successfully', session });
    } catch (error) {
      res.status(500).send({ message: 'Error fetching session', error });
    }
  };


// ---- Update Class Session -----

const updateClassSession = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const session = await ClassSession.findById(id);
      if (!session) return res.status(404).send({ message: 'Session not found' });
  
      // Update fields and save
      Object.assign(session, updatedData);
      await session.save();
  
      // Log changes in history
      await SessionHistory.create({
        sessionId: id,
        changeLog: updatedData,
        changedBy: req.user._id,
        changedDate: new Date(),
      });
  
      res.status(200).send({ message: 'Session updated successfully', session });
    } catch (error) {
      res.status(500).send({ message: 'Error updating session', error });
    }
  };

// Soft Class Session Delete if Class Cancelled

const deleteClassSession = async (req, res) => {
    try {
      const { id } = req.params;
  
      const session = await ClassSession.findById(id);
      if (!session) return res.status(404).send({ message: 'Session not found' });
  
      // Mark as cancelled
      session.status = 'Cancelled';
      await session.save();
  
      res.status(200).send({ message: 'Session deleted successfully', session });
    } catch (error) {
      res.status(500).send({ message: 'Error deleting session', error });
    }
  };


//   -- Search Session  

const searchClassSession = async (req, res) => {
    try {
      const { status, sessionType, sessionMode, batchId, startDate, endDate, keyword } = req.body;
  
      const filters = {};
      if (status) filters.status = status;
      if (sessionType) filters.sessionType = sessionType;
      if (sessionMode) filters.sessionMode = sessionMode;
      if (batchId) filters.batchId = batchId;
      if (startDate && endDate) filters.batchDate = { $gte: startDate, $lte: endDate };
  
      if (keyword) {
        filters.$or = [
          { batchStartTiming: { $regex: keyword, $options: 'i' } },
          { batchEndTiming: { $regex: keyword, $options: 'i' } },
        ];
      }
  
      const sessions = await Session.find(filters);
      res.status(200).send({ message: 'Sessions searched successfully', sessions });
    } catch (error) {
      res.status(500).send({ message: 'Error searching sessions', error });
    }
  };
  
  
  

  




  module.exports={createClassSession, getClassSessions, updateClassSession, deleteClassSession, getClassSessionbyId, searchClassSession }
  