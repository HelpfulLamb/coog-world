const serviceController = require('../controllers/serviceController.js');
const express = require('express');
const serviceRouter = express.Router();

// create new rides
serviceRouter.post('/', serviceController.createService);

// retrieve rides (all or specific)
serviceRouter.get('/', serviceController.getAllServices);
serviceRouter.get('/:id', serviceController.getServiceById);

// delete rides (all or specific)
serviceRouter.delete('/', serviceController.deleteAllServices);
serviceRouter.delete('/:id', serviceController.deleteServiceById);


module.exports = {
    serviceRouter
}