const { Ride } = require('../models/rideModel.js');

const getRides = async (req, res) => {
    try {
        const rides = await Ride.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(rides));
    } catch (error) {
        console.error('Error fetching rides: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getRides
}