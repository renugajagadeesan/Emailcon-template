const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');

        // // Handle disconnections and attempt to reconnect
        // mongoose.connection.on('disconnected', () => {
        //     console.error('MongoDB disconnected! Attempting to reconnect...');
        //     setTimeout(connectDB, 2000); // Retry after 2 seconds
        // });
    } catch (err) {
        console.error('Database connection error:', err.message);
        console.error('Full error details:', err);

        // // Retry on network errors or ECONNRESET
        // if (err.code === 'ECONNRESET' || err.name === 'MongoNetworkError' || err.message.includes('ETIMEDOUT')) {
        //     console.log('Retrying connection in 2 seconds...');
        //     setTimeout(connectDB, 2000); // Retry after 2 seconds
        // } else {
        //     console.log('Not retrying on this error');
        // }
    }
};

// // Initial connection attempt
// connectDB();

module.exports = connectDB;