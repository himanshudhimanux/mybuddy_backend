const SessionYear = require('../models/SessionYear');

// ✅ Create Session Year
const createSessionYear = async (req, res) => {
  try {
    const { startMonth, startYear, endYear, defaultYear } = req.body;

    if (!startMonth || !startYear || !endYear) {
      return res.status(400).json({ message: "Start month, start year, and end year are required" });
    }

    const sessionTitle = `${startYear}–${endYear}`;

    // If this session is marked as default, reset all others to false
    if (defaultYear) {
      await SessionYear.updateMany({}, { $set: { defaultYear: false } });
    }

    const sessionYear = new SessionYear({
      startMonth,
      startYear,
      endYear,
      sessionTitle,
      defaultYear,
      createdBy: req.user.userId,
    });

    await sessionYear.save();

    res.status(201).json({ message: 'Session year created successfully', sessionYear });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Session Years
const getSessionYears = async (req, res) => {
  try {
    const sessionYears = await SessionYear.find().populate('createdBy');
    res.status(200).json(sessionYears);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Session Year
const updateSessionYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { startMonth, startYear, endYear, defaultYear } = req.body;

    if (!startMonth || !startYear || !endYear) {
      return res.status(400).json({ message: "Start month, start year, and end year are required" });
    }

    const sessionTitle = `${startYear}–${endYear}`;

    // If updating to default year, remove default from others
    if (defaultYear) {
      await SessionYear.updateMany({}, { $set: { defaultYear: false } });
    }

    const sessionYear = await SessionYear.findByIdAndUpdate(
      id,
      {
        startMonth,
        startYear,
        endYear,
        sessionTitle,
        defaultYear,
        updatedDate: Date.now(),
      },
      { new: true }
    );

    if (!sessionYear) {
      return res.status(404).json({ message: 'Session year not found' });
    }

    res.status(200).json({ message: 'Session year updated successfully', sessionYear });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Session Year
const deleteSessionYear = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionYear = await SessionYear.findByIdAndDelete(id);
    if (!sessionYear) {
      return res.status(404).json({ message: 'Session year not found' });
    }
    res.status(200).json({ message: 'Session year deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSessionYear,
  getSessionYears,
  updateSessionYear,
  deleteSessionYear
};
