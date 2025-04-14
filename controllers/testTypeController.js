// controllers/testTypeController.js
const TestType = require('../models/TestTypes');

// Create TestType
exports.createTestType = async (req, res) => {
  try {
    const { testType } = req.body;

    console.log("test type", testType)

    const testTypeExists = await TestType.findOne({ testType });
    if (testTypeExists) {
      return res.status(400).json({ success: false, message: 'Test Type already exists' });
    }

    const newTestType = new TestType({ testType });
    await newTestType.save();

    console.log("new test type", newTestType)

    res.status(201).json({ success: true, data: newTestType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get All TestTypes
exports.getAllTestTypes = async (req, res) => {
  try {
    const testTypes = await TestType.find();
    res.status(200).json({ success: true, data: testTypes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Single TestType by ID
exports.getTestTypeById = async (req, res) => {
  try {
    const testType = await TestType.findById(req.params.id);
    if (!testType) {
      return res.status(404).json({ success: false, message: 'Test Type not found' });
    }
    res.status(200).json({ success: true, data: testType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update TestType
exports.updateTestType = async (req, res) => {
  try {
    const { testType } = req.body;

   

    const updatedTestType = await TestType.findByIdAndUpdate(
      req.params.id,
      { testType },
      { new: true }
    );
    if (!updatedTestType) {
      return res.status(404).json({ success: false, message: 'Test Type not found' });
    }
    res.status(200).json({ success: true, data: updatedTestType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete TestType
exports.deleteTestType = async (req, res) => {
  try {
    const testType = await TestType.findByIdAndDelete(req.params.id);
    if (!testType) {
      return res.status(404).json({ success: false, message: 'Test Type not found' });
    }
    res.status(200).json({ success: true, message: 'Test Type deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
