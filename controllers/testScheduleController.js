const moment = require('moment');
const TestSchedule = require('../models/TestSchedule');
const TestType = require('../models/TestTypes');
const { default: mongoose } = require('mongoose');
const Course = require('../models/Course'); // Changed from BatchClass
const Subject = require('../models/Subject');


// Create Test Schedule Handler
exports.createTestSchedule = async (req, res) => {
  try {
    const {
      testTypeId,
      courseId,
      subjectId,
      syllabus,
      comment,
      testDate, // only used if sessionType is 'Single'
      status,
      sessionType,
      maxMarks,
      minMarks,
      scheduleDetails,
    } = req.body;

    const testType = await TestType.findById(testTypeId);
    const course = await Course.findById(courseId);
    const subject = await Subject.findById(subjectId);

    console.log("testType", testType)
    console.log("course", course)
    console.log("subject", subject)

    if (!testType || !course || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Test Type, Course, or Subject not found',
      });
    }

    const testSchedules = generateTestSchedules({
      testTypeId,
      courseId,
      subjectId,
      syllabus,
      comment,
      testDate,
      status,
      sessionType,
      maxMarks,
      minMarks,
      scheduleDetails,
    });

    console.log("testSchedules", testSchedules)

    const createdTestSchedules = await TestSchedule.insertMany(testSchedules);

    console.log("createdTestSchedules", createdTestSchedules)

    res.status(201).json({ success: true, data: createdTestSchedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating test schedule' });
  }
};



// Generate Test Schedules Utility
const generateTestSchedules = (data) => {
  const {
    scheduleDetails,
    sessionType,
    testDate,
    testTypeId,
    courseId,
    subjectId,
    syllabus,
    comment,
    status,
    maxMarks,
    minMarks,
  } = data;

  const schedules = [];

  if (sessionType === 'Single') {
    schedules.push({
      testDate: new Date(testDate),
      testTypeId,
      courseId,
      subjectId,
      syllabus,
      comment,
      status,
      sessionType,
      maxMarks,
      minMarks,
      scheduleDetails: {
        startDate: new Date(testDate),
        endDate: new Date(testDate),
        startTime: scheduleDetails.startTime,
        endTime: scheduleDetails.endTime,
      },
    });
    return schedules;
  }

  const {
    startDate,
    endDate,
    startTime,
    endTime,
    repeatEvery,
    weeklyDays = [],
    onDay,
    onThe,
  } = scheduleDetails;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (sessionType === 'Every Day') {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      schedules.push({
        testDate: new Date(d),
        testTypeId,
        courseId,
        subjectId,
        syllabus,
        comment,
        status,
        sessionType,
        maxMarks,
        minMarks,
        scheduleDetails: {
          startDate,
          endDate,
          startTime,
          endTime,
        },
      });
    }
  } else if (sessionType === 'Weekly') {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (weeklyDays.includes(day)) {
        schedules.push({
          testDate: new Date(d),
          testTypeId,
          courseId,
          subjectId,
          syllabus,
          comment,
          status,
          sessionType,
          maxMarks,
          minMarks,
          scheduleDetails: {
            startDate,
            endDate,
            startTime,
            endTime,
            weeklyDays,
            repeatEvery,
          },
        });
      }
    }
  } else if (sessionType === 'Monthly') {
    const monthStart = new Date(start);
    while (monthStart <= end) {
      const date = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        onDay || 1
      );
      if (date >= start && date <= end) {
        schedules.push({
          testDate: date,
          testTypeId,
          courseId,
          subjectId,
          syllabus,
          comment,
          status,
          sessionType,
          maxMarks,
          minMarks,
          scheduleDetails: {
            startDate,
            endDate,
            startTime,
            endTime,
            repeatEvery,
            onDay,
            onThe,
          },
        });
      }
      monthStart.setMonth(monthStart.getMonth() + 1);
    }
  }

  return schedules;
};


// Get All TestSchedules
exports.getAllTestSchedules = async (req, res) => {
  try {
    const testSchedules = await TestSchedule.find().populate('testTypeId');
    res.status(200).json({ success: true, data: testSchedules });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching test schedules' });
  }
};

// Get TestSchedule by ID
exports.getTestScheduleById = async (req, res) => {
  try {
    const testSchedule = await TestSchedule.findById(req.params.id).populate('testTypeId');

    if (!testSchedule) {
      return res.status(200).json({ success: false, message: 'Test Schedule not found' });
    }

    return res.status(200).json({ success: true, data: testSchedule });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching test schedule' });
  }
};

// Update TestSchedule
exports.updateTestSchedule = async (req, res) => {
  try {
    const {
      testDate, testTypeId, courseId, subjectId, syllabus, comment,
      startTime, endTime, sessionType, status, maxMarks, minMarks
    } = req.body;

    const updatedTestSchedule = await TestSchedule.findByIdAndUpdate(
      req.params.id,
      { testDate, testTypeId, courseId, subjectId, syllabus, comment, startTime, endTime, sessionType, status, maxMarks, minMarks },
      { new: true }
    );

    if (!updatedTestSchedule) {
      return res.status(404).json({ success: false, message: 'Test Schedule not found' });
    }

    res.status(200).json({ success: true, data: updatedTestSchedule });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating test schedule' });
  }
};

// Delete TestSchedule
exports.deleteTestSchedule = async (req, res) => {
  try {
    const testSchedule = await TestSchedule.findByIdAndDelete(req.params.id);
    if (!testSchedule) {
      return res.status(404).json({ success: false, message: 'Test Schedule not found' });
    }
    res.status(200).json({ success: true, message: 'Test Schedule deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting test schedule' });
  }
};

// Get Upcoming Tests
// Get Tests for Selected Date and Course
exports.getUpcomingTestsByDate = async (req, res) => {
  try {
    const { courseId, selectedDate } = req.query;

    if (!courseId || !selectedDate) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and selected date are required',
      });
    }

    const start = moment.utc(selectedDate).startOf('day');
    const end = moment.utc(selectedDate).endOf('day');

    const query = {
      courseId: new mongoose.Types.ObjectId(courseId),
      testDate: { $gte: start.toDate(), $lte: end.toDate() },
      status: 'Active',
    };

    const tests = await TestSchedule.find(query)
      .sort({ testDate: 1 })
      .populate('courseId testTypeId subjectId');

    if (!tests.length) {
      return res.status(200).json({
        success: false,
        message: 'No tests found for the selected date.',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tests fetched successfully.',
      data: tests,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tests.',
    });
  }
};

// Get Past Tests
exports.getPastTests = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required to fetch past tests',
      });
    }

    const start = startDate
      ? moment(startDate).utc().startOf('day')
      : moment('2000-01-01').utc();

    const end = endDate
      ? moment(endDate).utc().endOf('day')
      : moment().utc().endOf('day');

    const tests = await TestSchedule.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      testDate: { $gte: start.toDate(), $lte: end.toDate() },
      status: 'Active',
    }).populate('courseId subjectId testTypeId');

    return res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching past tests',
    });
  }
};


exports.getAllPastTestsForAdmin  = async (req, res) => {
  try {
    const today = new Date();

    const pastTests = await TestSchedule.find({
      testDate: { $lt: today }
    })
      .populate('testTypeId')
      .populate('courseId')
      .populate('subjectId')
      .sort({ testDate: -1 }); // descending order

    res.status(200).json(pastTests);
  } catch (error) {
    console.error('Error fetching past tests:', error);
    res.status(500).json({ message: 'Server error fetching past tests' });
  }
};


exports.getTestsByType = async (req, res) => {
  try {
    const { testType, startDate, endDate, courseId } = req.query;

    // ✅ Validate required parameters (studentId removed)
    if (
      !testType ||
      !['upcoming', 'active', 'past'].includes(testType) ||
      !startDate ||
      !endDate ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid testType, startDate, endDate, or courseId',
        data: null,
        error: 'ValidationError',
      });
    }

    const start = moment.utc(startDate).startOf('day').toDate();
    const end = moment.utc(endDate).endOf('day').toDate();
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    // ✅ Base query
    const query = {
      status: 'Active',
      courseId,
    };

    // ✅ Date condition based on testType
    if (testType === 'upcoming') {
      query.testDate = { $gt: todayEnd, $lte: end };
    } else if (testType === 'active') {
      query.testDate = { $gte: todayStart, $lte: todayEnd };
    } else if (testType === 'past') {
      query.testDate = { $lt: todayStart, $gte: start };
    }

    const tests = await TestSchedule.find(query)
      .sort({ testDate: 1 })
      .populate('courseId testTypeId subjectId');

    return res.status(200).json({
      success: true,
      message: `Tests fetched successfully (${testType})`,
      data: tests,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tests',
      data: null,
      error: error.message || error,
    });
  }
};



