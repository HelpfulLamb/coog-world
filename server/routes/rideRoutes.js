const rideController = require('../controllers/rideController.js');
const express = require('express');
const rideRouter = express.Router();

// create new rides
rideRouter.post('/create-ride', rideController.createRide);
rideRouter.post('/log', rideController.logVisitorRide);

// update existing rides
rideRouter.put('/:id', rideController.updateRide);

// retrieve rides (all or specific)
rideRouter.get('/', rideController.getAllRides);
rideRouter.get('/info', rideController.getRideInfo);
rideRouter.get('/user-view', rideController.getRideForCard);
rideRouter.get('/history/:id', rideController.getVisitorRideHistory);
rideRouter.get('/:id', rideController.getRideById);

// delete rides (all or specific)
rideRouter.delete('/delete-all', rideController.deleteAllRides);
rideRouter.delete('/delete-selected', rideController.deleteRideById);


module.exports = {
    rideRouter
}
