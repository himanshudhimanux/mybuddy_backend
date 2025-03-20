const Subject = require('../models/Subject');

// Create Subject
const createSubject = async (req, res) => {
  try {
    const { name, subjecttype, subjectFee, FacultyId } = req.body;
    const subject = new Subject({ name, subjecttype, FacultyId, subjectFee });
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('FacultyId');
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const subject = await Subject.findByIdAndUpdate(id, updatedData, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={createSubject, getSubjects, updateSubject, deleteSubject}