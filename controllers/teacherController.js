const multer = require("multer");
const Teacher = require("../models/Teacher");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// POST: Register Teacher
const teacherRegister = async (req, res) => {
  try {
    const { name, subject, address, phone, gender } = req.body;

    // ✅ Check if subject already assigned
    const existingTeacher = await Teacher.findOne({ subject });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "This subject is already assigned to another teacher.",
      });
    }

    const teacher = new Teacher({
      name,
      subject,
      address,
      phone,
      gender,
      photo: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await teacher.save();

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error in teacherRegister:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// GET: All Teachers (No pagination or search)
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "All teachers fetched successfully",
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
};

// GET: Specific Teacher by ID
const specificTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });

    res.json({
      success: true,
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
};

// PUT: Update Teacher
const updateTeacher = async (req, res) => {
  try {
    const { name, subject, address, phone, gender } = req.body;

    const updatedData = {
      name,
      subject,
      address,
      phone,
      gender,
    };

    if (req.file) {
      updatedData.photo = `/uploads/${req.file.filename}`;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!teacher)
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });

    res.json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating teacher",
      error: error.message,
    });
  }
};

// DELETE: Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher)
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting teacher",
      error: error.message,
    });
  }
};

// Export all controllers
module.exports = {
  upload,
  teacherRegister,
  getAllTeachers,
  specificTeacher,
  updateTeacher,
  deleteTeacher,
};
