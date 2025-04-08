
const ticketController = require('../controllers/ticketController.js');
const express = require('express');
const ticketRouter = express.Router();

// Create a new ticket
ticketRouter.post('/create-ticket', ticketController.createTicket);

// update existing ticket
ticketRouter.put('/:id', ticketController.updateTicket);

// Retrieve ticket info
ticketRouter.get('/', ticketController.getAllTickets);
ticketRouter.get('/info', ticketController.getTicketInfo);
ticketRouter.get('/:num', ticketController.getTicketByNum);
ticketRouter.get('/purchases/:userId', ticketController.getUserTicketPurchases);


// delete ticket (all or specific)
ticketRouter.delete('/delete-all', ticketController.deleteAllTickets);
ticketRouter.delete('/delete-selected', ticketController.deleteTicketById);


// Ticket purchase
ticketRouter.post('/purchase', ticketController.purchaseTicket);

module.exports = {
    ticketRouter
};
