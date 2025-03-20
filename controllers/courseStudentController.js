const CourseStudent = require('../models/CourseStudentSchema');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
    try {
        const {
            studentId,
            studentRollNo,
            courseId,
            joiningDate,
            payableFees,
            totalCourseFees,
            discountComment,
            numberOfInstallments,
            installmentType,
            createdBy
        } = req.body;

        // Validate if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student is already enrolled in the course
        const existingEnrollment = await CourseStudent.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Student is already enrolled in this course' });
        }

        // Create enrollment
        const newEnrollment = new CourseStudent({
            studentId,
            studentRollNo,
            courseId,
            joiningDate,
            payableFees,
            totalCourseFees,
            discountComment,
            numberOfInstallments,
            installmentType,
            createdBy
        });

        await newEnrollment.save();
        res.status(201).json({ message: 'Student enrolled successfully', enrollment: newEnrollment });

    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all enrolled students in a course
exports.getEnrolledStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const students = await CourseStudent.find({ courseId })
            .populate('studentId', 'name email')
            .populate('courseId', 'courseName')
            .populate('createdBy', 'name');

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrolled students', error: error.message });
    }
};

// Remove a student from a course
exports.removeStudent = async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await CourseStudent.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment record not found' });
        }

        await CourseStudent.findByIdAndDelete(enrollmentId);
        res.status(200).json({ message: 'Student removed from course successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error removing student from course', error: error.message });
    }
};
