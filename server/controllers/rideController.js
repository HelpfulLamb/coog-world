const rideModel = require('../models/rideModel.js');

exports.createRide = async (req, res) => {
    try {
        const {name, type, maintenance_date, cost, operators, status} = req.body;
        const rideId = await rideModel.createRide(name, type, maintenance_date, cost, operators, status);
        res.status(201).json({id: rideId, name, type, maintenance_date, cost, operators, status});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllRides = async (req, res) => {
    try {
        const rides = await rideModel.getAllRides();
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getRideById = async (req, res) => {
    try {
        const ride = await rideModel.getRideById(req.params.id);
        if(!ride){
            return res.status(404).json({message: 'Ride not found'});
        }
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllRides = async (req, res) => {
    try {
        await rideModel.deleteAllRides();
        res.status(200).json({message: 'All rides deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteRideById = async (req, res) => {
    try {
        await rideModel.deleteRideById(req.params.id);
        res.status(200).json({message: 'Ride deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};