const ticketModel= require('../models/ticketModel.js');

exports.createTicket = async (req, res) => {
    try {
        const {type, price} = req.body;
        const ticketNum = await ticketModel.createTicket(type, price);
        res.status(201).json({num: ticketNum, type, price});
    } catch (error) {
        res.status(500).json({message: error.message});
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