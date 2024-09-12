// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Configure rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `windowMs`
  message: 'Too many login attempts from this IP, please try again later.',
});

module.exports = loginLimiter;
