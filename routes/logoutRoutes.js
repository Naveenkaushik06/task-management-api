const express = require('express');
const router = express.Router();
const Blacklist = require('../models/Blacklist');
const jwt = require('jsonwebtoken');

// Logout Route - Invalidate the token
router.post('/logout', async (req, res) => {
    let token = req.header('Authorization');

    // Check if the Authorization header is present
    if (!token) {
        return res.status(400).json({ msg: 'Authorization header is missing' });
    }

    // Check if token is provided in Bearer format and remove 'Bearer ' if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    // If token is still empty after removing Bearer, return an error
    if (!token) {
        return res.status(400).json({ msg: 'Token is missing' });
    }

    try {
        // Decode the token
        const decoded = jwt.decode(token);

        // Check if the token is invalid or cannot be decoded
        if (!decoded) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Extract expiration time from the decoded token
        const expiresAt = new Date(decoded.exp * 1000);

        // Save the token to the blacklist
        const blacklistedToken = new Blacklist({
            token,
            expiresAt
        });
        await blacklistedToken.save();

        // Send a success message after successful logout
        res.status(200).json({ msg: 'User logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err.message);

        // Gracefully handle any unexpected errors
        res.status(500).json({ msg: 'An error occurred during logout. Please try again later.' });
    }
});

module.exports = router;
