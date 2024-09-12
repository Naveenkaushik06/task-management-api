// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const checkTokenBlacklist = require('../middlewares/checkTokenBlacklist'); // Middleware for token verification

// User Registration Route
router.post('/register', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            username,
            email,
            password
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile - Protected Route
router.get('/profile', checkTokenBlacklist, async (req, res) => {
    try {
        // Retrieve the user's profile from the database
        const user = await User.findById(req.user.id).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Return the user's profile
        res.json({
            username: user.username,
            email: user.email,
            roles: user.role, // Assuming you have a roles field
            createdAt: user.createdAt, // Any other field you want to include
        });
    } catch (err) {
        console.error('Error fetching user profile', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;














// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const { body, validationResult } = require('express-validator');
// const checkTokenBlacklist = require('../middlewares/checkTokenBlacklist'); // Middleware for token verification

// // User Registration Route
// router.post('/register', [
//     body('username').not().isEmpty().withMessage('Username is required'),
//     body('email').isEmail().withMessage('Please include a valid email'),
//     body('password')
//         .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
//         .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
//         .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
//         .matches(/[0-9]/).withMessage('Password must contain at least one number')
//         .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character')
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password } = req.body;

//     try {
//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         // Create a new user
//         user = new User({
//             username,
//             email,
//             password
//         });

//         // Hash the password before saving
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         // Save the user
//         await user.save();

//         res.status(201).json({
//             message: 'User registered successfully',
//             user: {
//                 username: user.username,
//                 email: user.email
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });



// // Get User Profile - Protected Route
// router.get('/profile', checkTokenBlacklist, async (req, res) => {
//     try {
//         // Retrieve the user's profile from the database
//         const user = await User.findById(req.user.id).select('-password'); // Exclude the password field

//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         // Return the user's profile
//         res.json({
//             username: user.username,
//             email: user.email,
//             roles: user.role, // Assuming you have a roles field
//             createdAt: user.createdAt, // Any other field you want to include
//         });
//     } catch (err) {
//         console.error('Error fetching user profile', err);
//         res.status(500).json({ msg: 'Server error' });
//     }
// });



// module.exports = router;
