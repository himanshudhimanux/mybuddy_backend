const Session = require('../models/Session');
const BatchClass = require('../models/BatchClass');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Attendance = require('../models/AttendanceSchema')

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

    // Fetch the batch class, teacher, and subject by name
    const batchClass = await BatchClass.findOne({ _id: batchClassId });
    const teacher = await Teacher.findOne({ _id: teacherId });
    const subject = await Subject.findOne({ _id: subjectId });
    
    console.log("Batch Class ID", batchClass);
    console.log("Teacher", teacher)
    console.log("subject", teacher)


    // If any of them is not found, return an error
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


const getStudentSessionsAndAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all sessions where this student is enrolled
    const sessions = await Session.find({ "batchClassId": { $exists: true } })
      .populate('batchClassId', 'name') // Fetch batch class name
      .populate('subjectId', 'name') // Fetch subject name
      .populate('teacherId', 'name') // Fetch teacher name
      .populate('scheduleDetails') // ✅ Correct - This will fetch the entire object
      .sort({ batchDate: 1 });

    // Extract session IDs
    const sessionIds = sessions.map(session => session._id);

    // Fetch attendance records for this student for the given sessions
    const attendanceRecords = await Attendance.find({
      studentId,
      sessionId: { $in: sessionIds }
    });



    // Map sessions with attendance status
    const sessionData = sessions.map(session => {
      const attendance = attendanceRecords.find(
        att => att.sessionId.toString() === session._id.toString()
      );

      return {
        sessionId: session._id,
        batchDate: session.batchDate,
        subject: session.subjectId.name, // Subject name
        teacher: session.teacherId.name, // Teacher name
        batchClass: session.batchClassId.name, // Batch class name
        classType: session.classType,
        sessionMode: session.sessionMode,
        sessionType: session.sessionType,
        status: session.status,
        scheduleDetails: {
          startDate: session.scheduleDetails?.startDate,
          endDate: session.scheduleDetails?.endDate,
          startTime: session.scheduleDetails?.startTime,
          endTime: session.scheduleDetails?.endTime,
          weeklyDays: session.scheduleDetails?.weeklyDays || [],
          repeatEvery: session.scheduleDetails?.repeatEvery,
          onDay: session.scheduleDetails?.onDay,
          onThe: session.scheduleDetails?.onThe
        },
        attended: !!attendance, // Boolean: true if attended, false otherwise
        attendanceDetails: attendance
          ? {
              attendanceDate: attendance.attendanceDate,
              attendanceTime: attendance.attendanceTime,
              attendanceSource: attendance.attendanceSource,
              attendanceType: attendance.attendanceType, // 'In' or 'Out'
              notificationSent: attendance.notificationSent || []
            }
          : null // If no attendance record, return null
      };
    });

    res.status(200).json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    console.error("Error fetching student sessions and attendance:", error);
    res.status(500).json({ success: false, message: "Error fetching data" });
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
      }).sort({ batchDate: 1 })      .populate("subjectId", "name") // Get only the subject name
      .populate("teacherId", "name"); // Get only the teacher name;



      res.status(200).json({ success: true, data: upcomingSessions });
  } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      res.status(500).json({ success: false, message: 'Error fetching upcoming sessions' });
  }
};




module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionsByType,
  getStudentSessionsAndAttendance,
  getUpcomingSessions
};
