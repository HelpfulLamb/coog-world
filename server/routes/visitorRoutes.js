const db = require('../config/db');
const visitorController = require('../controllers/visitorController.js');
const express = require('express');
const visitorRouter = express.Router();

// create new user
visitorRouter.post('/register', visitorController.registerUser);
visitorRouter.post('/login', visitorController.loginUser);

// retrieve users (all or specific)
visitorRouter.get('/', visitorController.getAllUsers);
visitorRouter.get('/:id', visitorController.getUserById);

// delete users (all or specific)
visitorRouter.delete('/', visitorController.deleteAllUsers);
visitorRouter.delete('/:id', visitorController.deleteUserById);

visitorRouter.put('/:id', visitorController.updateVisitor); 

module.exports = {
    visitorRouter
}