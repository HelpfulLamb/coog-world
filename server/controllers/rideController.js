const rideModel = require('../models/rideModel.js');
const db = require('../config/db.js');

exports.createRide = async (req, res) => {
    const {Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff} = req.body;
    if(!Ride_name || !Ride_type || !Ride_loc || !Ride_cost || !Ride_staff){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingRide = await rideModel.findRideByName(Ride_name);
        if(existingRide){
            return res.status(400).json({message: 'A ride with that name already exits. Please try a new name.'});
        }
        await rideModel.createRide({Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff});
        res.status(201).json({message: 'New ride added successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateRide = async (req, res) => {
    try {
        const rideID = req.params.id;
        const updatedData = req.body;
        const selectedRide = {...updatedData, Ride_ID: rideID};
        const updatedRide = await rideModel.updateRide(selectedRide);
        if(!updatedRide){
            return res.status(404).json({message: 'Ride not found or not updated.'});
        }
        res.status(200).json({message: 'Ride updated successfully.', ride: updatedData});
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
        const ride = await rideModel.getRideForCard(); // ⬅️ this calls the correct function
        if (!ride) {
            return res.status(404).json({ message: 'Ride information not found.' });
        }
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const {Ride_ID} = req.body;
        if(!Ride_ID){
            return res.status(400).json({message: 'Invalid ride ID provided. Check server status.'});
        }
        await rideModel.deleteRideById(Ride_ID);
        res.status(200).json({message: 'Ride deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.logVisitorRide = async (req, res) => {
    const { Visitor_ID, Ride_ID } = req.body;

    if (!Visitor_ID || !Ride_ID) {
        return res.status(400).json({ message: 'Visitor_ID and Ride_ID are required.' });
    }

    try {
        await db.query(
            'INSERT INTO visitor_ride_log (Visitor_ID, Ride_ID) VALUES (?, ?)',
            [Visitor_ID, Ride_ID]
        );
        res.status(201).json({ success: true, message: 'Ride logged successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to log ride.', error: err.message });
    }
};
exports.getVisitorRideHistory = async (req, res) => {
    const visitorId = req.params.id;
    try {
        const history = await rideModel.getVisitorRideHistory(visitorId);
        res.status(200).json({ rides: history });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ride history.', error: error.message });
    }
};

// Function to fetch ride stats by month
exports.getRideStatsByMonth = async (req, res) => {
    const { month } = req.query; // Get month from query parameter
    
    // Validate month input format (YYYY-MM)
    const monthFormatRegex = /^\d{4}-\d{2}$/;
    if (!month) {
        return res.status(400).json({ message: 'Month is required.' });
    }

    if (!monthFormatRegex.test(month)) {
        return res.status(400).json({ message: 'Invalid month format. Please use YYYY-MM format.' });
    }

    try {
        const stats = await rideModel.getRideStatsByMonth(month); // Fetch stats from the model
        
        if (stats.length === 0) { // Handle case where no data is found
            return res.status(404).json({ message: 'No ride stats found for this month.' });
        }

        // Return the ride stats as a JSON response
        res.status(200).json(stats);
    } catch (error) {
        // If an error occurs, return a 500 status code with the error message
        res.status(500).json({ message: error.message });
    }
};


