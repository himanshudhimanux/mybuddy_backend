const BatchStudent = require('../models/BatchStudentSchema');
const Batch = require('../models/BatchSchema'); 

// Create Batch Student
const createBatchStudent = async (req, res) => {
    try {
        const {
            studentId,
            batchId,
            payableFees,
            discountComment,
            installmentType,
        } = req.body;

        const existingStudent = await BatchStudent.findOne({ studentId, batchId });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already added to this batch' });
        }

        const batch = await Batch.findById(batchId).populate('courseIds');
        console.warn(batch)
        if (!batch || !batch.courseIds) {
            return res.status(404).json({ message: 'Batch or associated course not found' });
        }

        const totalCourseFees = courseIds.courseFee;
        console.log(totalCourseFees)

        const lastStudent = await BatchStudent.find({ batchId }).sort({ studentRollNo: -1 }).limit(1);
        const studentRollNo = lastStudent.length > 0 ? lastStudent[0].studentRollNo + 1 : 1;

        const batchStudent = new BatchStudent({
            studentId,
            studentRollNo,
            batchId,
            joiningDate: new Date(),
            payableFees,
            totalCourseFees,
            discountComment,
            installmentType,
            createdBy: req.user.userId,
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

module.exports = {
    createBatchStudent,
    getBatchStudents,
    getBatchStudentById,
    updateBatchStudent,
    deleteBatchStudent,
};
