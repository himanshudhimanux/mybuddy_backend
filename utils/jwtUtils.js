const jwt = require('jsonwebtoken');
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expiration
    });
};

module.exports = generateToken;
