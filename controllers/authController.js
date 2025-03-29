const User = require('../models/UserModel');
const Student = require("../models/Student");
const generateToken = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userRegsiter = async (req, res) => {

    const { name, email, phoneNumber, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ name, email, password, phoneNumber, role });
        await newUser.save();
        
        res.json({ newUser, msg: 'User Registered Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Login API (Father Phone) for Student APp
const loginWithPhone = async (req, res) => {
    try {
        const { fatherPhone } = req.body;

        if (!fatherPhone) {
            return res.status(400).json({ message: "Father phone number is required" });
        }

        // Check if phone number exists in the database
        const students = await Student.find({ fatherPhone });

        if (!students.length) {
            return res.status(404).json({ message: "No students found for this phone number" });
        }

        // Generate dummy OTP
        const otp = "1234"; // For now, it's fixed

        res.status(200).json({ message: "OTP sent successfully", otp }); // In real-world, don't send OTP in response
    } catch (error) {
        console.error("Error in loginWithPhone:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// for Student App 
const verifyOtp = async (req, res) => {
    try {
        const { fatherPhone, otp } = req.body;

        if (!fatherPhone || !otp) {
            return res.status(400).json({ message: "Phone number and OTP are required" });
        }

        // Validate OTP
        if (otp !== "1234") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Generate JWT Token
        const token = jwt.sign({ fatherPhone }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "OTP verified successfully", token });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};


// ------------- Admin App ---------------


// Login API Admin Phone Number
const adminLoginwithPhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Check if phone number exists in the database
        const admins = await User.find({ phoneNumber });

        if (!admins.length) {
            return res.status(404).json({ message: "No admin found for this phone number" });
        }

        // Generate dummy OTP
        const otp = "1234"; // For now, it's fixed

        res.status(200).json({ message: "OTP sent successfully", otp }); // In real-world, don't send OTP in response
    } catch (error) {
        console.error("Error in adminLoginwithPhone:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};


const verifyAdminOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: "Phone number and OTP are required" });
        }

        // Validate OTP (Here, "1234" is hardcoded for testing. Implement actual OTP verification logic)
        if (otp !== "1234") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find Admin User by phone number
        const user = await User.findOne({ phoneNumber, role: "admin" });

        if (!user) {
            return res.status(404).json({ message: "Admin user not found" });
        }

        // Generate JWT Token with userId and role
        const token = generateToken(user._id, user.role);

        res.status(200).json({ 
            message: "OTP verified successfully", 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
            role: user.role 
        });


    } catch (error) {
        console.error("Error in verifyAdminOtp:", error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};



module.exports={userRegsiter, userLogin, loginWithPhone, verifyOtp , adminLoginwithPhone , verifyAdminOtp}
