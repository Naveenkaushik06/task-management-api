// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Import your User model
const loginLimiter = require('../middlewares/rateLimiter'); // Import rate limiter
const router = express.Router();
const { registerManager } = require('../controllers/authController');

// Login Route with Rate Limiting
router.post('/login', loginLimiter, [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Token generation error:', err);
                    return res.status(500).send('Server error');
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
});


// Manager registration endpoint
router.post('/manager/register', registerManager);


module.exports = router;

