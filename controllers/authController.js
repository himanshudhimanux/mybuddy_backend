const User = require('../models/UserModel');
const Student = require("../models/Student");
const generateToken = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userRegsiter = async (req, res) => {

    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        const token = generateToken(newUser._id);
        res.json({ token, msg: 'User Registered Successfully' });
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



// Login API (Father Phone)
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
        const token = jwt.sign({ fatherPhone }, "JWT_SECRET", { expiresIn: "7d" });

        res.status(200).json({ message: "OTP verified successfully", token });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};





module.exports={userRegsiter, userLogin, loginWithPhone, verifyOtp}
