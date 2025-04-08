
const ticketController = require('../controllers/ticketController.js');
const express = require('express');
const ticketRouter = express.Router();

// Create a new ticket
ticketRouter.post('/create-ticket', ticketController.createTicket);

// Retrieve ticket info
ticketRouter.get('/', ticketController.getAllTickets);
ticketRouter.get('/info', ticketController.getTicketInfo);
ticketRouter.get('/:num', ticketController.getTicketByNum);
ticketRouter.get('/purchases/:userId', ticketController.getUserTicketPurchases);


// Delete ticket(s)
ticketRouter.delete('/', ticketController.deleteAllTickets);
ticketRouter.delete('/:num', ticketController.deleteTicketByNum);

// Ticket purchase
ticketRouter.post('/purchase', ticketController.purchaseTicket);

module.exports = {
    ticketRouter
};
