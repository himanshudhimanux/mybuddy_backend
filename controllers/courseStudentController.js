const CourseStudent = require('../models/CourseStudentSchema'); 
const Course = require('../models/Course');
const Subject = require('../models/Subject');

const createCourseStudent = async (req, res) => {
    try {

        const {
            studentId,
            courseId,
            subjectIds,  // Array of selected subjects
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

        console.log("course get ", course)

        // Fetch selected subjects
        const subjects = await Subject.find({ '_id': { $in: subjectIds } });
        if (!subjects || subjects.length === 0) {
            return res.status(400).json({ message: 'Invalid subjects selected' });
        }

        console.log("get subjects", subjects)

        // Calculate total fee based on selected subjects
        // const totalSubjectFees = subjects.reduce((total, subject) => total + subject.subjectFee, 0);

        const totalSubjectFees = subjects.reduce((total, subject) => total + Number(subject.subjectFee), 0);

    console.log("total fee", totalSubjectFees)

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
            createdBy: req.user.userId || null,

        });

        console.log("Decoded user:", req.user);

        console.log("course student add data", courseStudent)

        await courseStudent.save();
        res.status(201).json({ message: 'Student added to course successfully', courseStudent });
    } catch (error) {
        console.error('Error adding student to course:', error);
        res.status(500).json({ message: 'Error adding student to course', error });
    }
};

// get course details of student

const getStudentCourseDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const courseDetails = await CourseStudent.find({ studentId })
            .populate('courseId', 'name duration') // populate course name and duration
            .populate('subjectIds', 'name') // populate subject names
            .populate('studentId', 'name registrationNumber') // populate basic student info
            .populate('createdBy', 'name'); // populate user who created it

        if (!courseDetails || courseDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No course found for this student.",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully.",
            data: courseDetails
        });
    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};



module.exports={
    createCourseStudent,
    getStudentCourseDetails
}