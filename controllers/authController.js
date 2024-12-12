const User = require('../models/UserModel');
const generateToken = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');

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


module.exports={userRegsiter, userLogin}
