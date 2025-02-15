const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; // Attach user info to request
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const roleCheck = (...roles) => (req, res, next) => {
    if (!req.user?.role) {
        return res.status(401).json({ message: 'Invalid token payload' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};


module.exports={verifyToken, roleCheck}