//config // config.js
const dotenv = require('dotenv');

// Load environment variables from .env file

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager',
    JWT_SECRET: process.env.JWT_SECRET ,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',  // Default expiration for JWT
};