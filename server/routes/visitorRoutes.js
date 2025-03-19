const visitorController = require('../controllers/visitorController.js');
const express = require('express');
const visitorRouter = express.Router();

// create new user
visitorRouter.post('/', visitorController.createUser);

// retrieve users (all or specific)
visitorRouter.get('/', visitorController.getAllUsers);
visitorRouter.get('/', visitorController.getUserById);

// delete users (all or specific)
visitorRouter.delete('/', visitorController.deleteAllUsers);
visitorRouter.delete('/', visitorController.deleteUserById);

module.exports = {
    visitorRouter
}