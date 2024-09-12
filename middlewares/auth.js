const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check if token is in the Authorization header or x-auth-token header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log(`Token: ${token}`);
    } else if (req.headers['x-auth-token']) {
        token = req.headers['x-auth-token'];
    }

    // If no token is found, return an error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the decoded token's ID
        req.user = await User.findById(decoded.user.id).select('-password');

        // Log the user's role for debugging
        console.log('User role is:', req.user.role);
        
        // If user is not found, return an error
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, unauthorized' });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);  // Log the error
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};
