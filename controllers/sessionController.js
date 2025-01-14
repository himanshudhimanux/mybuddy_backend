const Session = require('../models/Session'); 

// Create Session Handler
const createSession = async (req, res) => {
  try {
    const {
      batchClassId,
      batchDate,
      status,
      classType,
      sessionMode,
      subjectId,
      teacherId,
      sessionType,
      scheduleDetails,
      absentNotification,
      presentNotification,
    } = req.body;

    const sessionData = {
      batchClassId,
      batchDate,
      status,
      classType,
      sessionMode,
      subjectId,
      teacherId,
      sessionType,
      scheduleDetails,
      absentNotification,
      presentNotification,
      // createdBy: req.user.userId
    };

    // Generate multiple sessions based on sessionType
    const sessions = generateSessions(sessionData);

    // Save sessions to the database
    const createdSessions = await Session.insertMany(sessions);

    res.status(201).json({ success: true, data: createdSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating session' });
  }
};

// Generate Sessions Utility
const generateSessions = (data) => {
  const { sessionType, scheduleDetails } = data;
  const { startDate, endDate, startTime, endTime, weeklyDays, repeatEvery, onDay, onThe } = scheduleDetails;

  const sessions = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (sessionType === 'Single') {
    sessions.push({
      ...data,
      batchDate: startDate,
    });
  } else if (sessionType === 'Every Day') {
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      sessions.push({
        ...data,
        batchDate: new Date(date),
      });
    }
  } else if (sessionType === 'Weekly') {
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      if (weeklyDays.includes(dayOfWeek)) {
        sessions.push({
          ...data,
          batchDate: new Date(date),
        });
      }
    }
  } else if (sessionType === 'Monthly') {
    for (let date = start; date <= end; date.setMonth(date.getMonth() + repeatEvery)) {
      if (onDay) {
        const sessionDate = new Date(date.getFullYear(), date.getMonth(), onDay);
        sessions.push({
          ...data,
          batchDate: sessionDate,
        });
      }
    }
  }

  return sessions;
};


// Get all sessions with search, pagination, and filtering
const getSessions = async (req, res) => {
  try {

    const { page = 1, limit = 10, search = "", type } = req.query;

    // Search and filter conditions
    const query = {};
    if (search) {
      query.$or = [
        { batchClassId: { $regex: search, $options: "i" } },
        { classType: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (type) query.sessionType = type;

    // Pagination and sorting
    const skip = (page - 1) * limit;

    // Fetch sessions
    const sessions = await Session.find(query)
      .sort({ createdAt: -1 }) // Sort by latest
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments(query); // Total sessions count

    res.status(200).json({
      success: true,
      data: sessions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single session by ID
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a session
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const session = await Session.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a session
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndDelete(id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search sessions by type (Single, Every Day, Weekly, Monthly)
const getSessionsByType = async (req, res) => {
  try {
    const { type } = req.params; // e.g., "Single", "Every Day", etc.
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const sessions = await Session.find({ sessionType: type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments({ sessionType: type });

    res.status(200).json({
      success: true,
      data: sessions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionsByType
};
