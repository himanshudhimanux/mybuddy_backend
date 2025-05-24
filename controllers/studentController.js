const mongoose = require('mongoose');
const multer = require("multer");
const Student = require("../models/Student");
// controllers/studentTodayInfo.js
const Session = require('../models/Session');
const TestSchedule = require('../models/TestSchedule');
const StudentPunch = require('../models/StudnetPunch');


// Function to generate registration numbers
const generateRegistrationNumber = async () => {
    try {
        const currentYear = new Date().getFullYear().toString(); // e.g., 2025
        console.warn(currentYear);

        // Count the students registered in the current year
        const currentYearPrefix = `REG-${currentYear}-`;
        const studentCount = await Student.countDocuments({
            registrationNumber: { $regex: `^${currentYearPrefix}` }, // Match registration numbers starting with current year
        });

        const uniqueId = (studentCount + 1).toString().padStart(4, "0"); // e.g., 0001
        return `REG-${currentYear}-${uniqueId}`; // Format: REG-2025-0001
    } catch (error) {
        throw new Error("Failed to generate registration number");
    }
};


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to the filename
    },
});
const upload = multer({ storage }); // Multer middleware

// POST: Register Student
const studentRegister = async (req, res) => {
    try {
        const {
            name,
            fatherName,
            motherName,
            address,
            fatherPhone,
            motherPhone,
            studentPhone,
            dob,
            gender,
            email,
        } = req.body;

        // Validation for required fields
        if (!name || !fatherName || !motherName || !address || !dob || !gender || !fatherPhone) {
            return res.status(400).json({ message: "All mandatory fields are required" });
        }

        // Generate registration number
        const registrationNumber = await generateRegistrationNumber();

        // Create a new student object
        const newStudent = new Student({
            registrationNumber,
            name,
            fatherName,
            motherName,
            address,
            fatherPhone,
            motherPhone,
            studentPhone,
            dob: new Date(dob),
            gender,
            email,
            photo: req.file ? `/uploads/${req.file.filename}` : undefined,
        });

        // Save to the database
        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully", student: newStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Server error: Unable to add student" });
    }
};


// GET: All Students with Pagination
const getAllStudent = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", filter = {} } = req.query;

        // Build the query for filtering and searching
        const query = {
            $and: [
                filter, // Apply additional filters, e.g., { gender: "male" }
                {
                    $or: [
                        { registrationNumber: { $regex: search, $options: "i" } },
                        { name: { $regex: search, $options: "i" } }, // Case-insensitive search
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } }
                    ]
                }
            ]
        };

        const students = await Student.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Student.countDocuments(query);

        res.json({
            students,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
};

// GET: Specific Student by ID
const specificStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};





// PUT: Update Student
const updateStudent = async (req, res) => {
    try {
        const {
            name,
            fatherName,
            motherName,
            address,
            fatherPhone,
            motherPhone,
            studentPhone,
            dob,
            gender,
            email,
        } = req.body;

        const updatedFields = {
            name,
            fatherName,
            motherName,
            address,
            fatherPhone,
            motherPhone,
            studentPhone,
            dob: dob ? new Date(dob) : undefined,
            gender,
            email,
        };

        // If a new photo is uploaded, update it
        if (req.file) {
            updatedFields.photo = `/uploads/${req.file.filename}`;
        }

        // Remove undefined fields to avoid overwriting existing data
        Object.keys(updatedFields).forEach(
            (key) => updatedFields[key] === undefined && delete updatedFields[key]
        );

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true } // Return the updated document
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Failed to update student", error: error.message });
    }
};

// DELETE: Delete Student
const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully", student: deletedStudent });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Failed to delete student", error: error.message });
    }
};


// ✅ 1. Get students by fatherPhone
const getStudentsByFatherPhone = async (req, res) => {
    try {
        
        const { fatherPhone } = req.query;

        if (!fatherPhone) {
            return res.status(400).json({ success: false, message: "Father phone number is required" });
        }

        const phoneNumber = Number(fatherPhone);
        const students = await Student.find({ fatherPhone: phoneNumber });

        if (!students.length) {
            return res.status(404).json({ success: false, message: "No students found for this phone number" });
        }

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            students,
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// ✅ 2. Switch Student Profile
const switchStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required to switch profile" });
        }

        // ✅ Find student by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile switched successfully",
            student,
        });

    } catch (error) {
        console.error("Error switching profile:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getTodayStudentInfo = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid studentId' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today sessions (Regular class)
    const todaySessions = await Session.find({
      batchDate: { $gte: today, $lt: tomorrow },
      status: 'Active',
      classType: { $in: ['Regular', 'Revision', 'Guest Lecture', 'Other'] }
    })
      .populate('subjectId teacherId batchClassId');

    // Get today tests
    const todayTests = await TestSchedule.find({
      testDate: { $gte: today, $lt: tomorrow },
      status: 'Active'
    })
      .populate('subjectId testTypeId courseId');

    // Get today's punch times for the student
    const punches = await StudentPunch.find({
      studentId,
      punchTime: { $gte: today, $lt: tomorrow }
    }).sort({ punchTime: 1 });

    const punchIn = punches.find(p => p.type === 'IN');
    const punchOut = punches.reverse().find(p => p.type === 'OUT');

    return res.status(200).json({
      success: true,
      message: 'Student today data fetched successfully',
      data: {
        sessions: todaySessions,
        tests: todayTests,
        punchInTime: punchIn ? punchIn.punchTime : null,
        punchOutTime: punchOut ? punchOut.punchTime : null
      }
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Search student by registrationNumber OR name OR fatherName
const searchStudentPerformance =  async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        // Case-insensitive partial match search
        const searchRegex = new RegExp(query, 'i');

        const student = await Student.findOne({
            $or: [
                { registrationNumber: searchRegex },
                { name: searchRegex },
                { fatherName: searchRegex },
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student found matching the query",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student found successfully",
            data: student
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}



module.exports = { 
    studentPicUpload: upload.single("photo"), // Middleware for file upload
    studentRegister, 
    getAllStudent, 
    specificStudent, 
    updateStudent, 
    deleteStudent ,
    getStudentsByFatherPhone, 
    switchStudentProfile,
    getTodayStudentInfo,
    searchStudentPerformance
};
