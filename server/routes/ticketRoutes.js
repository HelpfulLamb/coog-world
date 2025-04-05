const ticketController = require('../controllers/ticketController.js');
const express = require('express');
const ticketRouter = express.Router();

// create a new ticket
ticketRouter.post('/create-ticket', ticketController.createTicket);

// retreive ticket (all or specific)
ticketRouter.get('/', ticketController.getAllTickets);
ticketRouter.get('/info', ticketController.getTicketInfo);
ticketRouter.get('/:num', ticketController.getTicketByNum);

// delete ticket (all or specific)
ticketRouter.delete('/', ticketController.deleteAllTickets);
ticketRouter.delete('/:num', ticketController.deleteTicketByNum);

module.exports = {
    ticketRouter
}