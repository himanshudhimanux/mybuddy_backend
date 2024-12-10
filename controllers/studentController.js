const Student = require("../models/Student");

// Function to generate registration numbers
const generateRegistrationNumber = async () => {
    try {
        const currentYear = new Date().getFullYear().toString(); // e.g., 2024
        const studentCount = await Student.countDocuments(); // Get total students
        const uniqueId = (studentCount + 1).toString().padStart(4, '0'); // e.g., 0001
        return `REG-${currentYear}-${uniqueId}`; // Format: REG-2024-0001
    } catch (error) {
        throw new Error("Failed to generate registration number");
    }
};

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
            photo,
            email,
        } = req.body;

        // Check if all mandatory fields are provided
        if (!name || !fatherName || !motherName || !address || !dob || !gender) {
            return res.status(400).json({ message: "All mandatory fields are required" });
        }

        // Generate a unique registration number
        const registrationNumber = await generateRegistrationNumber();

        if (!registrationNumber) {
            return res.status(500).json({ message: "Failed to generate registration number" });
        }

        const student = new Student({
            registrationNumber,
            name,
            fatherName,
            motherName,
            address,
            fatherPhone,
            motherPhone,
            studentPhone,
            dob,
            gender,
            photo,
            email,
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET: All Students with Pagination
const getAllStudent = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const students = await Student.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Student.countDocuments();

        res.json({
            students,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
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

module.exports = { studentRegister, getAllStudent, specificStudent };