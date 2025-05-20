const BatchClass = require("../models/BatchClass");

// 1. Create a Batch Class
const createBatchClass = async (req, res) => {
    try {
        const batchClass = new BatchClass(req.body);
        await batchClass.save();
        res.status(201).json({ success: true, message: "Batch Class created successfully", data: batchClass });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getBatchClasses = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, facultyId } = req.query;
        const filters = { ...(status && { status }), ...(facultyId && { facultyIds: facultyId }) };

        const [batchClasses, total] = await Promise.all([
            BatchClass.find(filters)
                .skip((page - 1) * limit)
                .limit(+limit)
                .populate("batchId facultyIds createdBy", "name")
                .sort({ createdDate: -1 }),
            BatchClass.countDocuments(filters),
        ]);

        res.json({ success: true, data: batchClasses, total, page: +page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 3. Get a Single Batch Class by ID
const getBatchClassById = async (req, res) => {
    try {
        const batchClass = await BatchClass.findById(req.params.id).populate("batchId facultyIds createdBy", "name");
        if (!batchClass) {
            return res.status(404).json({ success: false, message: "Batch Class not found" });
        }
        res.json({ success: true, data: batchClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// 4. Update a Batch Class
const updateBatchClass = async (req, res) => {
    try {
        const existingBatchClass = await BatchClass.findById(req.params.id);
        if (!existingBatchClass) {
            return res.status(404).json({ success: false, message: "Batch Class not found" });
        }
        const historyEntry = { ...existingBatchClass.toObject(), updatedDate: new Date() };
        const updatedBatchClass = await BatchClass.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedDate: new Date(), $push: { history: historyEntry } },
            { new: true }
        );
        res.json({ success: true, message: "Batch Class updated successfully", data: updatedBatchClass });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// 5. Delete a Batch Class
const deleteBatchClass = async (req, res) => {
    try {
        const batchClass = await BatchClass.findByIdAndUpdate(
            req.params.id,
            { status: "Deleted", updatedDate: new Date() },
            { new: true }
        );
        if (!batchClass) {
            return res.status(404).json({ success: false, message: "Batch Class not found" });
        }
        res.json({ success: true, message: "Batch Class deleted successfully", data: batchClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports={createBatchClass, getBatchClasses, updateBatchClass, deleteBatchClass, getBatchClassById}