const Institute = require("../models/Institute");



// POST: Register Insitute
const registerInsitute = async (req, res) => {
    try {
        const {
            name,
            logo,
            address,
            phone,
            email,
            contact,
            photo
        } = req.body;

        const institute = new Institute({
            name,
            logo,
            address,
            phone,
            email,
            contact,
            photo
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

module.exports = { registerInsitute, specificInstitute, getAllInstitutes};
