const rideModel = require('../models/rideModel.js');

exports.createRide = async (req, res) => {
    const {Ride_name, Ride_type, Ride_cost, Ride_staff} = req.body;
    if(!Ride_name || !Ride_type || !Ride_cost || !Ride_staff){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingRide = await rideModel.findRideByName(Ride_name);
        if(existingRide){
            return res.status(400).json({message: 'A ride with that name already exits. Please try a new name.'});
        }
        await rideModel.createRide({Ride_name, Ride_type, Ride_cost, Ride_staff});
        res.status(201).json({message: 'New ride added successfully.'});
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

exports.getRideInfo = async (req, res) => {
    try {
        const info = await rideModel.getRideInfo();
        if(!info){
            return res.status(404).json({message: 'Ride information not found.'});
        }
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getRideForCard = async (req, res) => {
    try {
        const ride = await rideModel.getRideForCard();
        if(!ride){
            return res.status(404).json({message: 'Ride information not found.'});
        }
        res.status(200).json(ride);
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