const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const checkTokenBlacklist = require('../middlewares/checkTokenBlacklist');
const checkRole = require('../middlewares/checkRole');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const logoutRoutes = require('./logoutRoutes');

// Admin Registration Route
router.use('/admin', adminRoutes);

// Authentication Route (Login)
router.use('/auth', authRoutes);

// User Registration Route
router.use('/user', userRoutes);

// Logout Route
router.use('/auth', checkTokenBlacklist, logoutRoutes);

// Task Routes
router.use('/tasks', checkTokenBlacklist, taskRoutes);

// Admin-only route to manage all users
router.get('/admin/users', checkTokenBlacklist, checkRole(['admin']), async (req, res) => {
    try {
        const users = await User.find(); // Admins can access all users
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Manager-only route to manage tasks
router.get('/manager/tasks', checkTokenBlacklist, checkRole(['manager']), async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id }); // Managers can access tasks assigned to them
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// User route to manage their own tasks
router.get('/user/tasks', checkTokenBlacklist, checkRole(['user', 'manager', 'admin']), async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id }); // Users can access only their own tasks
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route for any role to view their own profile
router.get('/profile', checkTokenBlacklist, checkRole(['user', 'manager', 'admin']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Users can view their own profile
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
