const multer = require("multer");
const Teacher = require("../models/Teacher");



// POST: Register Teacher
// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Store files in the "uploads" directory
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to the file name
    },
  });
  
  const upload = multer({ storage });
  
  // POST: Register Teacher

  const teacherRegister = async (req, res) => {
    try {
  
      const { name, subject, address, phone, gender , photo } = req.body;
  
      const teacher = new Teacher({
        name,
        subject,
        address,
        phone,
        gender,
        photo: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
  
      await teacher.save();
      res.status(201).json(teacher);
    } catch (error) {
      console.error("Error:", error); // Log full error details
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };


// GET: All Teacher with Pagination
const getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", filter = {} } = req.query;

        // Build the query for filtering and searching
        const query = {
            $and: [
                filter, // Apply additional filters, e.g., { gender: "male" }
                {
                    $or: [
                        { name: { $regex: search, $options: "i" } }, // Case-insensitive search
                        { subject: { $regex: search, $options: "i" } }
                    ]
                }
            ]
        };

        const teachers = await Teacher.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Teacher.countDocuments(query);

        res.json({
            teachers,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Teachers", error: error.message });
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

module.exports = { teacherRegister, upload, getAllTeachers, specificTeacher };
