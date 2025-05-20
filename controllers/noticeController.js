const express = require("express");
const Notice = require("../models/NoticeModel");
const multer = require("multer");
const router = express.Router();

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

// Create a new notice
const createNotice = async (req, res) => {
    try {
        const { title, description, postedBy } = req.body;
        const notice_img = req.file ? req.file.path : null; // get file path from multer

        const newNotice = new Notice({ title, description, notice_img, postedBy });
        await newNotice.save();

        res.status(201).json({ message: "Notice created successfully", notice: newNotice });
    } catch (error) {
        res.status(500).json({ message: "Error creating notice", error: error.message });
    }
};


// Get all notices
const getAllNotice =  async (req, res) => {
    try {
        const notices = await Notice.find().populate("postedBy", "name email");
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notices", error: error.message });
    }
}

// Get a single notice by ID
const singleNotice =  async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id).populate("postedBy", "name email");
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notice", error: error.message });
    }
}

// Update a notice
const updateNotice = async (req, res) => {
    try {
        const { title, description, notice_img } = req.body;
        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            { title, description, notice_img },
            { new: true }
        );
        if (!updatedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json({ message: "Notice updated successfully", notice: updatedNotice });
    } catch (error) {
        res.status(500).json({ message: "Error updating notice", error: error.message });
    }
}

// Delete a notice
const deleteNotice = async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (!deletedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notice", error: error.message });
    }
}

module.exports = {
    createNotice,
    singleNotice,
    getAllNotice,
    updateNotice,
    deleteNotice,
    upload
}
