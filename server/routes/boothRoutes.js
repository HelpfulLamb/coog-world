const boothController = require('../controllers/boothController.js');
const express = require('express');
const boothRouter = express.Router();

// create new rides
boothRouter.post('/', boothController.createBooth);

// retrieve rides (all or specific)
boothRouter.get('/', boothController.getAllBooths);
boothRouter.get('/:id', boothController.getBoothById);

// delete rides (all or specific)
boothRouter.delete('/', boothController.deleteAllBooths);
boothRouter.delete('/:id', boothController.deleteBoothById);


module.exports = {
    boothRouter
}