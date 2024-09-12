const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');

// Register the first Admin without authentication
exports.adminRegistration = async (req, res) => {

  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if any Admin exists in the database
    const existingAdmin = await Admin.findOne({ role: 'Admin' });

    // If no Admin exists, allow the registration of the first Admin without authentication
    if (!existingAdmin) {
      // Check if the user already exists with the given email
      let user = await Admin.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User with this email already exists' });
      }

      // Create a new Admin user
      user = new Admin({
        username,
        email,
        password,
        role: 'Admin' // Set the role to Admin for the first registered user
      });

      // Hash the password before saving it
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the new Admin user
      await user.save();

      // Create JWT token for the Admin
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      // Sign the token and return it in the response
      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Ensure that the JWT secret is properly configured in your environment
        { expiresIn: '1h' }, // Token expires in 1 hour
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      // Prevent further Admin registrations unless done by an existing Admin
      return res.status(403).json({ msg: 'An Admin already exists. Please contact the existing Admin for further registrations.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
