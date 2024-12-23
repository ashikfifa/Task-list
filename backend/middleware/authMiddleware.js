const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate users using JWT token
const authMiddleware = async (req, res, next) => {
    // Get Token from authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token is not present
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach both user details and userId to request
        req.user = user;               // Full user details
        req.userId = decoded.userId;   // Only user ID

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification error:', error);

        // Handle specific token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
