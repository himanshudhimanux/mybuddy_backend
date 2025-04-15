// controllers/testScheduleController.js
const moment = require('moment');
const TestSchedule = require('../models/TestSchedule');
const TestType = require('../models/TestTypes');
const { default: mongoose } = require('mongoose');
const BatchClass = require('../models/BatchClass');
const Subject = require('../models/Subject');



// Create Test Schedule Handler
exports.createTestSchedule = async (req, res) => {
  try {
    const {
      testTypeId,
      batchId,
      subjectId,
      testDate,
      testTime,
      status,
      sessionMode,
      maxMarks,
      minMarks,
      scheduleDetails,
    } = req.body;

    // Fetch test type, batch, and subject by ID
    const testType = await TestType.findOne({ _id: testTypeId });
    const batch = await BatchClass.findOne({ _id: batchId });
    const subject = await Subject.findOne({ _id: subjectId });

    console.log("Test Type", testType);
    console.log("Batch", batch);
    console.log("Subject", subject);

    // If any of them is not found, return an error
    if (!testType || !batch || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Test Type, Batch or Subject not found',
      });
    }

    const testScheduleData = {
      testTypeId: testType._id,
      batchId: batch._id,
      subjectId: subject._id,
      testDate,
      testTime,
      status,
      sessionMode,
      maxMarks,
      minMarks,
    };

    // Generate multiple test schedules based on session type
    const testSchedules = generateTestSchedules(testScheduleData);

    // Save test schedules to the database
    const createdTestSchedules = await TestSchedule.insertMany(testSchedules);

    res.status(201).json({ success: true, data: createdTestSchedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating test schedule' });
  }
};


// Generate Test Schedules Utility
exports.generateTestSchedules = (data) => {
  const { scheduleDetails, testDate, testTime } = data;
  const { startDate, endDate, repeatEvery, weeklyDays, onDay, monthlyDay } = scheduleDetails;

  const testSchedules = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // For a single test
  if (!repeatEvery) {
    testSchedules.push({
      ...data,
      testDate: startDate,
      testTime,
    });
  }
  // For recurring tests on a daily basis
  else if (repeatEvery === 'Every Day') {
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      testSchedules.push({
        ...data,
        testDate: new Date(date),
        testTime,
      });
    }
  }
  // For weekly repeating tests
  else if (repeatEvery === 'Weekly') {
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      if (weeklyDays.includes(dayOfWeek)) {
        testSchedules.push({
          ...data,
          testDate: new Date(date),
          testTime,
        });
      }
    }
  }
  // For monthly recurring tests
  else if (repeatEvery === 'Monthly') {
    for (let date = start; date <= end; date.setMonth(date.getMonth() + 1)) {
      if (onDay) {
        const testDate = new Date(date.getFullYear(), date.getMonth(), onDay);
        testSchedules.push({
          ...data,
          testDate,
          testTime,
        });
      } else if (monthlyDay) {
        const testDate = new Date(date.getFullYear(), date.getMonth(), monthlyDay);
        testSchedules.push({
          ...data,
          testDate,
          testTime,
        });
      }
    }
  }

  return testSchedules;
};



// Get All TestSchedules
exports.getAllTestSchedules = async (req, res) => {
  try {
    const testSchedules = await TestSchedule.find().populate('testTypeId');
    res.status(200).json({ success: true, data: testSchedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching test schedules' });
  }
};

// Get TestSchedule by ID
exports.getTestScheduleById = async (req, res) => {
  try {
    const testSchedule = await TestSchedule.findById(req.params.id).populate('testTypeId');
    if (!testSchedule) {
      return res.status(404).json({ success: false, message: 'Test Schedule not found' });
    }
    res.status(200).json({ success: true, data: testSchedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching test schedule' });
  }
};

// Update TestSchedule
exports.updateTestSchedule = async (req, res) => {
  try {
    const {
      testDate, testTypeId, batchId, subjectId, syllabus, comment,
      startTime, endTime, sessionType, status, maxMarks, minMarks
    } = req.body;

    const updatedTestSchedule = await TestSchedule.findByIdAndUpdate(
      req.params.id,
      { testDate, testTypeId, batchId, subjectId, syllabus, comment, startTime, endTime, sessionType, status, maxMarks, minMarks },
      { new: true }
    );

    if (!updatedTestSchedule) {
      return res.status(404).json({ success: false, message: 'Test Schedule not found' });
    }

    res.status(200).json({ success: true, data: updatedTestSchedule });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting test schedule' });
  }
};



exports.getUpcomingTests = async (req, res) => {
  try {
    const { batchId, subjectId } = req.query;

    if (!batchId || !subjectId) {
      return res.status(400).json({ message: "Batch ID and Subject ID are required" });
    }

    const batchObjectId = new mongoose.Types.ObjectId(batchId);
    const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    const currentDate = moment().utc().startOf('day');
    const fiveDaysLater = moment().utc().add(5, 'days').endOf('day');

    console.log("Looking for tests between", currentDate.toISOString(), "and", fiveDaysLater.toISOString());

    const allTests = await TestSchedule.find({});
    console.log("All test entries for debugging:", allTests);

    const tests = await TestSchedule.find({
      batchId: batchObjectId,
      subjectId: subjectObjectId,
      testDate: {
        $gte: currentDate.toDate(),
        $lte: fiveDaysLater.toDate(),
      },
      status: "Active",
    }).populate("batchId subjectId testTypeId");

    console.log("Matching tests:", tests);

    if (!tests.length) {
      return res.status(404).json({ message: "No upcoming tests found for this batch and subject" });
    }

    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error fetching upcoming tests:", error);
    return res.status(500).json({ message: "Error fetching upcoming tests" });
  }
};


exports.getUpcomingTests = async (req, res) => {
  try {
    const { batchId, startDate, endDate } = req.query;

    // Date setup
    const start = startDate
      ? moment(startDate).utc().startOf('day')
      : moment().utc().startOf('day');

    const end = endDate
      ? moment(endDate).utc().endOf('day')
      : moment().utc().add(7, 'days').endOf('day');

    // Query setup
    const query = {
      testDate: {
        $gte: start.toDate(),
        $lte: end.toDate(),
      },
      status: 'Active',
    };

    if (batchId) {
      query.batchId = new mongoose.Types.ObjectId(batchId);
    }

    const tests = await TestSchedule.find(query)
      .populate('batchId testTypeId subjectId');

    if (!tests.length) {
      return res.status(200).json({
        success: false,
        message: 'No upcoming tests found in the selected duration.',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Upcoming tests fetched successfully',
      data: tests,
    });

  } catch (error) {
    console.error("Error fetching upcoming tests:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching upcoming tests',
    });
  }
};


exports.getPastTests = async (req, res) => {
  try {
    const { batchId, startDate, endDate } = req.query;

    if (!batchId) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID is required to fetch past tests',
      });
    }

    const start = startDate
      ? moment(startDate).utc().startOf('day')
      : moment('2000-01-01').utc(); // Earliest possible date

    const end = endDate
      ? moment(endDate).utc().endOf('day')
      : moment().utc().subtract(1, 'day').endOf('day'); // Until yesterday

    const tests = await TestSchedule.find({
      batchId: new mongoose.Types.ObjectId(batchId),
      testDate: {
        $gte: start.toDate(),
        $lte: end.toDate(),
      },
      status: 'Active',
    }).populate('batchId testTypeId subjectId');

    if (!tests.length) {
      return res.status(200).json({
        success: false,
        message: 'No past tests found for this batch.',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Past tests fetched successfully',
      data: tests,
    });

  } catch (error) {
    console.error('Error fetching past tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching past tests',
    });
  }
};