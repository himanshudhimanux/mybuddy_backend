const Session = require('../models/Session');
const Batch = require('../models/BatchSchema');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Attendance = require('../models/AttendanceSchema');
const BatchStudent = require('../models/BatchStudentSchema');
const CourseBatchMap = require("../models/CourseBatchMap")

// Create Session
const createSession = async (req, res) => {
  try {
    const {
      batchId,
      status,
      classType,
      sessionMode,
      subjectId,
      teacherId,
      sessionType,
      scheduleDetails,
      absentNotification,
      presentNotification,
      roomNo,
      createdBy,
    } = req.body;

    const batch = await Batch.findById(batchId);
    const teacher = await Teacher.findById(teacherId);
    const subject = await Subject.findById(subjectId);


    if (!batch || !teacher || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Batch, Teacher, or Subject not found',
      });
    }

    const sessionData = {
      batchId: batch._id,
      status,
      classType,
      sessionMode,
      subjectId: subject._id,
      teacherId: teacher._id,
      sessionType,
      scheduleDetails,
      absentNotification,
      presentNotification,
      roomNo,
      createdBy,
    };

    const sessions = generateSessions(sessionData);
    const createdSessions = await Session.insertMany(sessions);

    res.status(201).json({ success: true, data: createdSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating session' });
  }
};

// Generate Sessions Based on Type
const generateSessions = (data) => {
  const { sessionType, scheduleDetails } = data;
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    weeklyDays = [],
    repeatEvery = 1,
    onDay,
    onThe,
  } = scheduleDetails;

  const sessions = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (sessionType === 'Single') {
    sessions.push({ ...data, batchDate: startDate });
  } else if (sessionType === 'Every Day') {
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      sessions.push({
        ...data,
        batchDate: new Date(date),
      });
    }
  } else if (sessionType === 'Weekly') {
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (weeklyDays.includes(dayName)) {
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

// Get All Sessions
const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { classType: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (type) query.sessionType = type;

    const sessions = await Session.find(query)
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments(query);

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

// Get Session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('subjectId', 'name')
      .populate('teacherId', 'name');
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Session
const updateSession = async (req, res) => {
  try {
    req.body.updatedDate = new Date();
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Sessions by Type
const getSessionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sessions = await Session.find({ sessionType: type })
      .sort({ createdDate: -1 })
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

// Get Sessions with Attendance for a Student
const getSessionsWithAttendance = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    const { studentId } = req.params;

    if (!studentId || !courseId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "studentId, courseId, startDate, and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Step 1: courseId से related सभी batches निकालो
    const courseBatchMappings = await CourseBatchMap.find({ courseId }).lean();
    const batchIds = courseBatchMappings.map(map => map.batchId);

    if (batchIds.length === 0) {
      return res.status(404).json({ success: false, message: "No batches found for this course." });
    }

    // Step 2: BatchStudent में चेक करो student इन batches में है या नहीं
    const studentBatches = await BatchStudent.find({
      studentId,
      batchId: { $in: batchIds }
    }).lean();

    if (!studentBatches.length) {
      return res.status(404).json({ success: false, message: "Student is not assigned to any batch for the selected course" });
    }

    const studentBatchIds = studentBatches.map(b => b.batchId);

    // Step 3: Sessions निकालो उन batches के लिए
    const sessions = await Session.find({
      batchId: { $in: studentBatchIds },
      batchDate: { $gte: start, $lte: end },
    })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .lean();

    // Step 4: हर session के लिए attendance चेक करो
    const sessionsWithAttendance = await Promise.all(
      sessions.map(async (session) => {
        const attendance = await Attendance.findOne({
          sessionId: session._id,
          studentId,
        }).lean();

        return {
          ...session,
          subject: session.subjectId?.name,
          teacher: session.teacherId?.name,
          attendance,
        };
      })
    );

    res.status(200).json({ success: true, data: sessionsWithAttendance });
  } catch (error) {
    console.error("Error fetching sessions with attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionsByType,
  getSessionsWithAttendance,
};
