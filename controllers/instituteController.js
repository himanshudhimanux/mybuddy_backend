const Institute = require("../models/Institute");
const multer = require('multer')

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'));
        }
    },
});

// POST: Register Insitute
const registerInsitute = async (req, res) => {
    try {
        const {
            name,
            address,
            phone,
            email,
            contact,
        } = req.body;

        const logo = req.file ? req.file.path : '';

        const institute = new Institute({
            name,
            logo,
            address,
            phone,
            email,
            contact,
            logo
        });

        await institute.save();
        res.status(201).json(institute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET: All Insitute with Pagination
const getAllInstitutes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const institutes = await Institute.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Institute.countDocuments();

        res.json({
            institutes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch insitutes", error: error.message });
    }
};

// GET: Specific Insitute by ID
const specificInstitute = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);
        if (!institute) return res.status(404).json({ message: "Institute not found" });
        res.json(institute);
    } catch (error) {
        res.status(500).json({ message: "Error fetching institute", error: error.message });
    }
};

// PUT: Update Institute
const updateInstitute = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedInstitute = await Institute.findByIdAndUpdate(id, updates, {
            new: true, // Returns the updated document
            runValidators: true, // Ensures the updates follow the schema rules
        });

        if (!updatedInstitute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        res.status(200).json(updatedInstitute);
    } catch (error) {
        res.status(500).json({ message: "Error updating institute", error: error.message });
    }
};


// DELETE: Delete Institute
const deleteInstitute = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInstitute = await Institute.findByIdAndDelete(id);

        if (!deletedInstitute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        res.status(200).json({ message: "Institute deleted successfully", deletedInstitute });
    } catch (error) {
        res.status(500).json({ message: "Error deleting institute", error: error.message });
    }
};

// Get Institutes based on search query
const searchInstitute = async (req, res) => {
    try {
      const { name } = req.query;
      const query = name ? { name: { $regex: name, $options: 'i' } } : {};
      const institutes = await Institute.find(query);
      res.status(200).json(institutes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { 
    registerInsitute, 
    specificInstitute, 
    getAllInstitutes, 
    updateInstitute, 
    deleteInstitute ,
    searchInstitute,
    upload
};
