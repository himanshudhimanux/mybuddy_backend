const BatchStudent = require('../models/BatchStudentSchema');

const createBatchStudent = async (req, res) => {
    try {
        const { studentId, studentRollNo, batchId, status } = req.body;

        const batchStudent = new BatchStudent({
            studentId,
            studentRollNo,
            batchId,
            status,
            createdBy: req.user.userId, // From auth middleware
        });

        await batchStudent.save();
        res.status(201).json({ message: 'Batch student created successfully', batchStudent });
    } catch (error) {
        console.error('Error creating batch student:', error);
        res.status(500).json({ message: 'Error creating batch student', error });
    }
};

// ---- Get All Student from batch  

const getBatchStudents = async (req, res) => {
    try {
        const { status, batchId, studentRollNo, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (batchId) filter.batchId = batchId;
        if (studentRollNo) filter.studentRollNo = new RegExp(studentRollNo, 'i'); // Case-insensitive search

        const batchStudents = await BatchStudent.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('studentId batchId createdBy', 'name email'); // Adjust fields to populate as needed

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

// get batch student by id  

const getBatchStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const batchStudent = await BatchStudent.findById(id).populate('studentId batchId createdBy', 'name email');

        if (!batchStudent) return res.status(404).json({ message: 'Batch student not found' });

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
        const { status } = req.body;

        const batchStudent = await BatchStudent.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!batchStudent) return res.status(404).json({ message: 'Batch student not found' });

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

        if (!batchStudent) return res.status(404).json({ message: 'Batch student not found' });

        res.status(200).json({ message: 'Batch student deleted successfully' });
    } catch (error) {
        console.error('Error deleting batch student:', error);
        res.status(500).json({ message: 'Error deleting batch student', error });
    }
};



module.exports={createBatchStudent, getBatchStudents, getBatchStudentById, updateBatchStudent, deleteBatchStudent}
