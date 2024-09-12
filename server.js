const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const protectedRoutes = require('./routes/protectedRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
// app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use(express.json()); // Middleware to parse JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // JSON parsing error
    res.status(400).json({ msg: 'Invalid JSON' });
  } else {
    // Pass other errors to the default error handler
    next(err);
  }
});

// API Routes
app.use('/api', protectedRoutes); // Use the consolidated protected routes

// Root route (Optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});