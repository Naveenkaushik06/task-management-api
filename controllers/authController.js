// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a manager
exports.registerManager = async (req, res) => {
    const { username, password, team } = req.body;

    try {
        // Check if the username already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

         // Check if the team members exist
         if (team && team.length > 0) {
            const usersExist = await User.find({ _id: { $in: team } });
            console.log(usersExist);
            console.log(team.length);
            
            if (usersExist.length !== team.length) {
                return res.status(400).json({ message: 'Some team members are not valid users' });
            }
        }

        // Hash the password before saving it in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new Manager user
        user = await User.create({
            username,
            password: hashedPassword,
            role: 'Manager',  // Set the role as Manager
            team  // Assign the team (array of user IDs that the manager manages)
        });

        // Generate a JWT token
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the response with the token
        res.status(201).json({
            token,
            message: 'Manager registered successfully',
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Error registering manager:', error);
        res.status(500).json({ message: 'Server error' });
    }
};