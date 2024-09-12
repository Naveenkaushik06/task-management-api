const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');

// Middleware to check if token is blacklisted and valid
const checkTokenBlacklist = async (req, res, next) => {
    let token = req.header('x-auth-token');
    console.log('Received token:', token);
    
    // Remove 'Bearer ' if present
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log('Processed Bearer token:', token);
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Check if token is blacklisted
        const blacklisted = await Blacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ msg: 'Token is blacklisted' });
        }

        // Verify token and attach user info (including roles) to req.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;  // Attach the user information to req.user (should contain user.id and user.role)
        console.log('Decoded User Info:', req.user);
        next();  // Proceed to the next middleware or route
    } catch (err) {
        console.error('Something went wrong with token verification', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = checkTokenBlacklist;
