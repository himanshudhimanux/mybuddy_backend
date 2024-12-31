const Attendance = require('../models/AttendanceSchema');
const BatchStudent = require('../models/BatchStudentSchema');


// Post Create Attendance 

const createAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, attendanceDateTime, attendanceSource, attendanceType, notificationSent } = req.body;

        // Check if the student is part of the batch associated with this session
        const isStudentInBatch = await BatchStudent.findOne({ studentId, batchId: req.body.batchId });

        if (!isStudentInBatch) {
            return res.status(400).json({ message: 'Student is not part of the batch for this session' });
        }

        const attendance = new Attendance({
            sessionId,
            studentId,
            attendanceDateTime,
            attendanceSource,
            attendanceType,
            notificationSent,
            createdBy: req.user.userId, // From auth middleware
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        console.error('Error creating attendance:', error);
        res.status(500).json({ message: 'Error creating attendance', error });
    }
};

// Get All Attendace with filter and pagination 

const getAttendanceRecords = async (req, res) => {
    try {
        const { sessionId, studentId, attendanceSource, attendanceType, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (sessionId) filter.sessionId = sessionId;
        if (studentId) filter.studentId = studentId;
        if (attendanceSource) filter.attendanceSource = attendanceSource;
        if (attendanceType) filter.attendanceType = attendanceType;

        const attendanceRecords = await Attendance.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('studentId sessionId createdBy', 'name email');

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            message: 'Attendance records fetched successfully',
            data: attendanceRecords,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
            },
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'Error fetching attendance records', error });
    }
};

// Get Attendance by Id 

const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.findById(id).populate('studentId sessionId createdBy', 'name email');

        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

        res.status(200).json({ message: 'Attendance record fetched successfully', attendance });
    } catch (error) {
        console.error('Error fetching attendance record:', error);
        res.status(500).json({ message: 'Error fetching attendance record', error });
    }
};

// Update Attendance 

const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { attendanceType, notificationSent } = req.body;

        const attendance = await Attendance.findByIdAndUpdate(
            id,
            { attendanceType, notificationSent },
            { new: true }
        );

        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

        res.status(200).json({ message: 'Attendance record updated successfully', attendance });
    } catch (error) {
        console.error('Error updating attendance record:', error);
        res.status(500).json({ message: 'Error updating attendance record', error });
    }
};


// Delete Attendance 

const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.findByIdAndDelete(id);

        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        res.status(500).json({ message: 'Error deleting attendance record', error });
    }
};



module.exports={createAttendance, getAttendanceRecords, updateAttendance, deleteAttendance, getAttendanceById}