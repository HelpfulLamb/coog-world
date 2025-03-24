const express = require('express');
const visitorController = require('../controllers/visitorController.js');
const authenticateJWT = require('../middleware/authMiddleware'); // Ensure this middleware exists

const visitorRouter = express.Router();

// Create new user
visitorRouter.post('/register', visitorController.registerUser);
visitorRouter.post('/login', visitorController.loginUser);

// Retrieve users (all or specific)
visitorRouter.get('/', visitorController.getAllUsers);
visitorRouter.get('/:id', visitorController.getUserById);

// Update user profile
visitorRouter.get('/profile', authenticateJWT, visitorController.getUserProfile);
visitorRouter.put('/profile', authenticateJWT, visitorController.updateUserProfile);

// Get order history
visitorRouter.get('/orders', authenticateJWT, visitorController.getOrderHistory);

// Delete users
visitorRouter.delete('/', visitorController.deleteAllUsers);
visitorRouter.delete('/:id', visitorController.deleteUserById);

module.exports = {
    visitorRouter
};