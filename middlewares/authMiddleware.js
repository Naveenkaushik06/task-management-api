// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the user info to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access denied' });
  }
};

module.exports = { authMiddleware, isAdmin };
























// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     // Get token from the request header (Assuming the token is sent in 'Authorization' header as 'Bearer <token>')
//     const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         // Verify the token using the secret key
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach user from the payload to the request object
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// module.exports = authMiddleware;
