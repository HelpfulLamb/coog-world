const { TicketType } = require('../models/ticketModel.js');

const getTicketTypes = async (req, res) => {
    try {
        const rides = await TicketType.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(rides));
    } catch (error) {
        console.error('Error fetching rides: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getTicketTypes
}