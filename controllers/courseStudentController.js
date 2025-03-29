const CourseStudent = require('../models/CourseStudentSchema'); 
const Course = require('../models/Course');
const Subject = require('../models/Subject');

const createCourseStudent = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            subjectIds,  // Array of selected subjects
            payableFees,
            discountComment,
            installmentType,
            numberOfInstallments,
            status,
        } = req.body;

        // Required fields check
        if (!studentId || !courseId || !subjectIds || subjectIds.length === 0 || !installmentType || !numberOfInstallments) {
            return res.status(400).json({ message: 'All required fields must be provided, including subjects.' });
        }

        // Check if student is already added to this course
        const existingStudent = await CourseStudent.findOne({ studentId, courseId });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already added to this course' });
        }

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch selected subjects
        const subjects = await Subject.find({ '_id': { $in: subjectIds } });
        if (!subjects || subjects.length === 0) {
            return res.status(400).json({ message: 'Invalid subjects selected' });
        }

        // Calculate total fee based on selected subjects
        const totalSubjectFees = subjects.reduce((total, subject) => total + subject.fee, 0);

        // Generate student roll number for this course
        const lastStudent = await CourseStudent.find({ courseId }).sort({ studentRollNo: -1 }).limit(1);
        const studentRollNo = lastStudent.length > 0 ? lastStudent[0].studentRollNo + 1 : 1;

        // Create new course student entry
        const courseStudent = new CourseStudent({
            studentId,
            studentRollNo,
            courseId,
            subjectIds,
            status,
            joiningDate: new Date(),
            payableFees: totalSubjectFees, // Updated logic
            totalCourseFees: totalSubjectFees,
            discountComment,
            installmentType,
            numberOfInstallments,
            createdBy: req.user?.userId || null,
        });

        await courseStudent.save();
        res.status(201).json({ message: 'Student added to course successfully', courseStudent });
    } catch (error) {
        console.error('Error adding student to course:', error);
        res.status(500).json({ message: 'Error adding student to course', error });
    }
};

module.exports={
    createCourseStudent
}