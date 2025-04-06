const rideController = require('../controllers/rideController.js');
const express = require('express');
const rideRouter = express.Router();

// create new rides
rideRouter.post('/create-ride', rideController.createRide);

// retrieve rides (all or specific)
rideRouter.get('/', rideController.getAllRides);
rideRouter.get('/info', rideController.getRideInfo);
rideRouter.get('/user-view', rideController.getRideForCard);
rideRouter.get('/:id', rideController.getRideById);

// delete rides (all or specific)
rideRouter.delete('/', rideController.deleteAllRides);
rideRouter.delete('/:id', rideController.deleteRideById);

rideRouter.post('/log', rideController.logVisitorRide);
rideRouter.get('/history/:id', rideController.getVisitorRideHistory);

module.exports = {
    rideRouter
}