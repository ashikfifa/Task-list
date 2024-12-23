// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify tokens
const User = require('../models/User');

//Register Route

router.post('/register', registerUser);

//Login Route

router.post('/login', loginUser);


// Route for fetching user profile (protected route)
router.get('/me', authMiddleware, getUserProfile);




module.exports = router;