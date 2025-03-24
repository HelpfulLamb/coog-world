const { getTicketTypes } = require('../controllers/ticketController.js');
const express = require('express');
const ticketRouter = express.Router();

ticketRouter.get('/', getTicketTypes);

// const ticketRoutes = (req, res) => {
//     if(req.url === '/ticket-type' && req.method === 'GET'){
//         getTicketTypes(req, res);
//     } else {
//         res.writeHead(404, {'Content-Type': 'text/plain'});
//         res.end('Not Found');
//     }
// }

module.exports = {
    ticketRouter
    // ticketRoutes
}