const Course = require('../models/Course');

// Create Course
const createCourse = async (req, res) => {
  try {
    const { name, courseType, subjectIds, courseFee } = req.body;
    const course = new Course({ name, courseType, subjectIds, courseFee });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('subjectIds');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const course = await Course.findByIdAndUpdate(id, updatedData, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports={createCourse, getCourses, updateCourse, deleteCourse}
