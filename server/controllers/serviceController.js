const { Service } = require('../models/serviceModel.js');

const getServices = async (req, res) => {
    try {
        const services = await Service.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(services));
    } catch (error) {
        console.error('Error fetching services: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getServices
}