const Session = require('../models/Session');
const BatchClass = require('../models/BatchClass');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Attendance = require('../models/AttendanceSchema')
const Batch = require("../models/BatchSchema");
const BatchStudent = require("../models/BatchStudentSchema")

// Create Session Handler
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
      roomNo, // ✅ New field added
    } = req.body;

    // Fetch the batch class, teacher, and subject by ID
    const batchClass = await BatchClass.findOne({ _id: batchClassId });
    const teacher = await Teacher.findOne({ _id: teacherId });
    const subject = await Subject.findOne({ _id: subjectId });

    console.log("Batch Class ID", batchClass);
    console.log("Teacher", teacher);
    console.log("Subject", subject);

    if (!batchClass || !teacher || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Batch Class, Teacher or Subject not found',
      });
    }

    const sessionData = {
      batchClassId: batchClass._id,
      batchDate,
      status,
      classType,
      sessionMode,
      subjectId: subject._id,
      teacherId: teacher._id,
      sessionType,
      scheduleDetails,
      absentNotification,
      presentNotification,
      roomNo, // ✅ Include in session data
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
  const { startDate, endDate, weeklyDays, repeatEvery, onDay } = scheduleDetails;

  const sessions = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (sessionType === 'Single') {
    sessions.push({
      ...data,
      batchDate: startDate,
    });
  } else if (sessionType === 'Every Day') {
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      sessions.push({
        ...data,
        batchDate: new Date(date),
      });
    }
  } else if (sessionType === 'Weekly') {
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      if (weeklyDays.includes(dayOfWeek)) {
        sessions.push({
          ...data,
          batchDate: new Date(date),
        });
      }
    }
  } else if (sessionType === 'Monthly') {
    for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + repeatEvery)) {
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



const getSessionsWithAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "StudentId is required" });
    }

    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const studentBatch = await BatchStudent.findOne({ studentId });
    if (!studentBatch) {
      return res.status(404).json({ success: false, message: "Student not assigned to any batch" });
    }

    const batchId = studentBatch.batchId;

    const batchClasses = await BatchClass.find({ batchId }).select('_id');
    const batchClassIds = batchClasses.map(cls => cls._id);

    if (!batchClassIds.length) {
      return res.status(200).json({ success: true, sessions: [] });
    }

    const sessions = await Session.find({
      batchClassId: { $in: batchClassIds },
      batchDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .lean();

    // No filtering here — we want to return all valid sessions
    const sessionsWithAttendance = await Promise.all(
      sessions.map(async session => {
        const attendance = await Attendance.findOne({
          sessionId: session._id,
          studentId,
        }).lean();

        // Remove weeklyDays or weekDay from scheduleDetails
        let cleanedScheduleDetails = null;
        if (session.scheduleDetails) {
          const { weeklyDays, weekDay, ...rest } = session.scheduleDetails;
          cleanedScheduleDetails = rest;
        }

        return {
          _id: session._id,
          batchDate: session.batchDate,
          classType: session.classType,
          sessionMode: session.sessionMode,
          roomNo: session.roomNo || null,
          subject: session.subjectId?.name || null,
          teacher: session.teacherId?.name || null,
          scheduleDetails: cleanedScheduleDetails,
          attendance: attendance || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      sessions: sessionsWithAttendance,
    });

  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const getUpcomingSessions = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "startDate and endDate are required" });
    }


    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure full day is covered

    const upcomingSessions = await Session.find({
      batchDate: { $gte: start, $lte: end }
    }).sort({ batchDate: 1 }).populate("subjectId", "name") // Get only the subject name
      .populate("teacherId", "name"); // Get only the teacher name;



    res.status(200).json({ success: true, data: upcomingSessions });
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({ success: false, message: 'Error fetching upcoming sessions' });
  }
};



const getDateSessions = async (req, res) => {
  try {
    const { date, courseId } = req.query;

    console.log("date session", date)
    console.log("courseId", courseId)

    if (!date || !courseId) {
      return res.status(400).json({ error: 'Date and Course ID are required' });
    }

    const sessions = await Session.find({
      batchDate: new Date(date),
      courseId,
    }).populate('batchId');

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionsByType,
  // getStudentSessionsAndAttendance,
  getUpcomingSessions,
  getDateSessions,
  getSessionsWithAttendance 
};
