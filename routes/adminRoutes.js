// Import required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const { body, validationResult } = require('express-validator');
const {adminRegistration} = require('../controllers/adminRegistration')

const router = express.Router();

// Admin registration route (with validation checks)
router.post('/register', [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password should be 6 or more characters').isLength({ min: 6 })
  ], adminRegistration);

// // Register first admin without authentication
// router.post('/register', [
//     // Validate input fields
//     body('username', 'Username is required').not().isEmpty(),
//     body('email', 'Please include a valid email').isEmail(),
//     body('password', 'Password should be 6 or more characters').isLength({ min: 6 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password } = req.body;

//     try {
//         // Check if any admin exists in the database
//         const existingAdmin = await User.findOne({ role: 'Admin' });
        
//         // If no admin exists, allow registration without authentication
//         if (!existingAdmin) {
//             let user = await User.findOne({ email });

//             if (user) {
//                 return res.status(400).json({ msg: 'User already exists' });
//             }

//             // Create a new admin user
//             user = new User({
//                 username,
//                 email,
//                 password,
//                 role: 'Admin' // Set the role as Admin for the first user
//             });

//             // Hash the password before saving
//             const salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(password, salt);

//             // Save the user
//             await user.save();

//             // Create a JWT token for the new admin
//             const payload = {
//                 user: {
//                     id: user.id,
//                     role: user.role
//                 }
//             };

//             jwt.sign(
//                 payload,
//                 process.env.JWT_SECRET, // Replace with your own JWT secret key
//                 { expiresIn: '1h' },
//                 (err, token) => {
//                     if (err) throw err;
//                     res.json({ token });
//                 }
//             );
//         } else {
//             return res.status(403).json({ msg: 'Admin already exists. Please contact an existing admin to register.' });
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

module.exports = router;