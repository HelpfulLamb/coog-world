const { Maintenance } = require('../models/maintenanceModel.js');

const getMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(maintenance));
    } catch (error) {
        console.error('Error fetching maintenance: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getMaintenance
}