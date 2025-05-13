const Attendance = require('../models/AttendanceSchema');
const moment = require('moment');
const BatchStudent = require('../models/BatchStudentSchema');
const Student = require('../models/Student');
const Session = require('../models/Session');
const mongoose = require('mongoose');

// Create Attendance
const createAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, attendanceDate, attendanceTime, attendanceSource, attendanceType, notificationSent } = req.body;

        // Check if the student is part of the batch associated with this session
        // Check if the student is part of the batch
        const isStudentInBatch = await BatchStudent.findOne({
            studentId: new mongoose.Types.ObjectId(studentId),
        });

        console.log("Checking for student:", studentId);

        console.log("isStudentInBatch", isStudentInBatch);


        if (!isStudentInBatch) {
            return res.status(400).json({ message: 'Student is not part of the batch for this session' });
        }

        const attendance = new Attendance({
            sessionId,
            studentId,
            attendanceDate,
            attendanceTime,
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

// Get All Attendance Records with Filters & Pagination
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

// Get Attendance by ID
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

// Get Eligible Students for a Session
const getEligibleStudents = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId).populate('batchId');
        if (!session) return res.status(404).json({ message: 'Session not found' });

        const batchStudents = await BatchStudent.find({ batchId: session.batchId }).populate('studentId', 'name');
        const students = batchStudents.map((bs) => bs.studentId);

        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching eligible students:', error);
        res.status(500).json({ message: 'Error fetching eligible students', error });
    }
};


// const getAttendanceSummary = async (req, res) => {
//     try {
//         const { studentId } = req.params;
//         const { type, month, startDate, endDate } = req.query;

//         let fromDate, toDate;

//         if (type === 'monthly') {
//             fromDate = moment(month + '-01').startOf('month').toDate();
//             toDate = moment(month + '-01').endOf('month').toDate();
//         } else if (type === 'weekly') {
//             fromDate = moment(startDate).startOf('day').toDate();
//             toDate = moment(endDate).endOf('day').toDate();
//         } else {
//             return res.status(400).json({ success: false, message: 'Invalid type' });
//         }

//         const records = await Attendance.find({
//             studentId,
//             attendanceDate: { $gte: fromDate, $lte: toDate }
//         });

//         const totalDays = records.length;
//         const present = records.filter(r => r.attendanceType === 'Present').length;
//         const absent = records.filter(r => r.attendanceType === 'Absent').length;
//         const leave = records.filter(r => r.attendanceType === 'Leave').length;

//         const percentages = {
//             present: totalDays ? Math.round((present / totalDays) * 100) : 0,
//             absent: totalDays ? Math.round((absent / totalDays) * 100) : 0,
//             leave: totalDays ? Math.round((leave / totalDays) * 100) : 0
//         };

//         return res.json({
//             success: true,
//             data: {
//                 totalDays,
//                 present,
//                 absent,
//                 leave,
//                 percentages
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// };


const getAttendanceSummary = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { type, month, startDate, endDate } = req.query;

        let fromDate, toDate;

        if (type === 'monthly') {
            if (month) {
                fromDate = moment(month + '-01').startOf('month').toDate();
                toDate = moment(month + '-01').endOf('month').toDate();
            } else {
                // Default: Last full month
                fromDate = moment().subtract(1, 'months').startOf('month').toDate();
                toDate = moment().subtract(1, 'months').endOf('month').toDate();
            }
        } else if (type === 'weekly') {
            if (startDate && endDate) {
                fromDate = moment(startDate).startOf('day').toDate();
                toDate = moment(endDate).endOf('day').toDate();
            } else {
                // Default: Last 7 days
                fromDate = moment().subtract(6, 'days').startOf('day').toDate();
                toDate = moment().endOf('day').toDate();
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        const records = await Attendance.find({
            studentId,
            attendanceDate: { $gte: fromDate, $lte: toDate }
        });

        const totalDays = records.length;
        const present = records.filter(r => r.attendanceType === 'Present').length;
        const absent = records.filter(r => r.attendanceType === 'Absent').length;
        const leave = records.filter(r => r.attendanceType === 'Leave').length;

        const percentages = {
            present: totalDays ? Math.round((present / totalDays) * 100) : 0,
            absent: totalDays ? Math.round((absent / totalDays) * 100) : 0,
            leave: totalDays ? Math.round((leave / totalDays) * 100) : 0
        };

        return res.json({
            success: true,
            data: {
                totalDays,
                present,
                absent,
                leave,
                percentages,
                fromDate,
                toDate
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


module.exports = {
    createAttendance,
    getEligibleStudents,
    getAttendanceRecords,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    getAttendanceSummary
};
