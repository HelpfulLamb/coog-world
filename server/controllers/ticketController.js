const ticketModel= require('../models/ticketModel.js');

exports.createTicket = async (req, res) => {
    const {ticket_type, price} = req.body;
    console.log('Request Body: ', req.body);
    if(!ticket_type || !price){
        return res.status(400).json({message: 'All fields are required!'});
    }
    try {
        const existingTicket = await ticketModel.findTicketByName(ticket_type);
        if(existingTicket){
            return res.status(400).json({message: 'A ticket with that name already exists. Please try again.'});
        }
        await ticketModel.createTicket({ticket_type, price});
        res.status(201).json({num: ticketNum, type, price});
    } catch (error) {
        console.error('Error adding new ticket: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getTicketInfo = async (req, res) => {
    try {
        const info = await ticketModel.getTicketInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getTicketByNum = async (req, res) => {
    try {
        const ticket = await ticketModel.getTicketByNum(req.params.num);
        if(!ticket){
            return res.status(404).json({message: 'Ticket not found'});
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllTickets = async (req, res) => {
    try {
        await ticketModel.deleteAllTickets();
        res.status(200).json({message: 'All tickets deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteTicketByNum = async (req, res) => {
    try {
        await ticketModel.deleteTicketByNum(req.params.num);
        res.status(200).json({message: 'Ticket deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};