const BatchStudent = require('../models/BatchStudentSchema');
const Batch = require('../models/BatchSchema'); 
const Course = require('../models/Course');


const createBatchStudent = async (req, res) => {
    try {
        const {
            studentId,
            batchId,
            payableFees,
            discountComment,
            installmentType,
            numberOfInstallments,
            status,
        } = req.body;

        // Check for missing fields
        if (!studentId || !batchId || !payableFees || !installmentType || !numberOfInstallments) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const existingStudent = await BatchStudent.findOne({ studentId, batchId });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already added to this batch' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        const courses = await Course.find({ '_id': { $in: batch.courseIds } });
        if (!courses || courses.length === 0) {
            return res.status(400).json({ message: 'No courses found for this batch.' });
        }

        const totalCourseFees = courses.reduce((total, course) => total + course.courseFee, 0);

        const lastStudent = await BatchStudent.find({ batchId }).sort({ studentRollNo: -1 }).limit(1);
        const studentRollNo = lastStudent.length > 0 ? lastStudent[0].studentRollNo + 1 : 1;

        const batchStudent = new BatchStudent({
            studentId,
            studentRollNo,
            batchId,
            status,
            joiningDate: new Date(),
            payableFees,
            totalCourseFees,
            discountComment,
            installmentType,
            numberOfInstallments,
            createdBy: req.user?.userId || null,
        });

        await batchStudent.save();
        res.status(201).json({ message: 'Batch student created successfully', batchStudent });
    } catch (error) {
        console.error('Error creating batch student:', error);
        res.status(500).json({ message: 'Error creating batch student', error });
    }
};


// Get All Batch Students
const getBatchStudents = async (req, res) => {
    try {
        const { batchId, status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (batchId) filter.batchId = batchId;
        if (status) filter.status = status;

        const batchStudents = await BatchStudent.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate({
                path: 'batchId',
                populate: {
                    path: 'courseIds',
                    select: 'name courseFee',
                },
                select: 'name',
            })
            .populate('studentId', 'name fatherName') // Fetch student details
            .populate('createdBy', 'name'); // Fetch creator details

        const total = await BatchStudent.countDocuments(filter);

        res.status(200).json({
            message: 'Batch students fetched successfully',
            data: batchStudents,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
            },
        });
    } catch (error) {
        console.error('Error fetching batch students:', error);
        res.status(500).json({ message: 'Error fetching batch students', error });
    }
};


// Get Batch Student by ID
const getBatchStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const batchStudent = await BatchStudent.findById(id)
            .populate({
                path: 'batchId',
                populate: {
                    path: 'courseIds',
                    select: 'courseName courseFee duration description',
                },
                select: 'name',
            })
            .populate('studentId', 'name email') // Fetch student details
            .populate('createdBy', 'name email'); // Fetch creator details

        if (!batchStudent) {
            return res.status(404).json({ message: 'Batch student not found' });
        }

        res.status(200).json({ message: 'Batch student fetched successfully', batchStudent });
    } catch (error) {
        console.error('Error fetching batch student:', error);
        res.status(500).json({ message: 'Error fetching batch student', error });
    }
};


// Update Batch Student
const updateBatchStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payableFees, discountComment, numberOfInstallments, installmentType } = req.body;

        const batchStudent = await BatchStudent.findByIdAndUpdate(
            id,
            { status, payableFees, discountComment, numberOfInstallments, installmentType },
            { new: true }
        );

        if (!batchStudent) {
            return res.status(404).json({ message: 'Batch student not found' });
        }

        res.status(200).json({ message: 'Batch student updated successfully', batchStudent });
    } catch (error) {
        console.error('Error updating batch student:', error);
        res.status(500).json({ message: 'Error updating batch student', error });
    }
};

// Delete Batch Student
const deleteBatchStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const batchStudent = await BatchStudent.findByIdAndDelete(id);

        if (!batchStudent) {
            return res.status(404).json({ message: 'Batch student not found' });
        }

        res.status(200).json({ message: 'Batch student deleted successfully' });
    } catch (error) {
        console.error('Error deleting batch student:', error);
        res.status(500).json({ message: 'Error deleting batch student', error });
    }
};



const getBatchStudentsByBatchId = async (req, res) => {
    const { batchId } = req.params;

    try {
        const students = await BatchStudent.find({ batchId })
            .populate('studentId', 'name photo') // Optional: student details
            .populate('batchId', 'name startDate endDate') // Optional: batch details
            .populate('createdBy', 'name role') // Optional: created by details
            .lean();

        return res.status(200).json({
            success: true,
            message: `Students fetched for batch ID: ${batchId}`,
            data: students,
        });
    } catch (error) {
        console.error('Error fetching batch students:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch batch students',
            error: error.message,
        });
    }
};



module.exports = {
    createBatchStudent,
    getBatchStudents,
    getBatchStudentById,
    updateBatchStudent,
    deleteBatchStudent,
    getBatchStudentsByBatchId
};
