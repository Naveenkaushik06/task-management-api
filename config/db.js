// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDB;













































// dotenv.config();

// console.log('MONGO_URI:', process.env.MONGO_URI); // Check the URI output

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err.message);
//         process.exit(1);  // Exit process with failure
//     }
// };

// connectDB();




















// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err.message);
//         process.exit(1);  // Exit process with failure
//     }
// };

// connectDB();
