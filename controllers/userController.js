const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const signToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
exports.register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = signToken(newUser);
        res.status(201).json({ token, user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = signToken(user);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
