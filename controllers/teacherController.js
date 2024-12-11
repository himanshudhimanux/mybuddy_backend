const Teacher = require("../models/Teacher");



// POST: Register Teacher
const teacherRegister = async (req, res) => {
    try {
        const {
            name,
            subject,
            address,
            phone,
            photo
        } = req.body;

        const teacher = new Teacher({
            name,
            subject,
            address,
            phone,
            photo
        });

        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET: All Teacher with Pagination
const getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const teachers = await Teacher.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Teacher.countDocuments();

        res.json({
            teachers,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
    }
};

// GET: Specific Teacher by ID
const specificTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teacher", error: error.message });
    }
};

module.exports = { teacherRegister, getAllTeachers, specificTeacher };
