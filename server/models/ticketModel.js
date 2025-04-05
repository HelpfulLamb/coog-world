const db = require('../config/db.js');

exports.findTicketByName = async (ticket_type) => {
    const [ticket] = await db.query('SELECT t.ticket_type FROM ticket_type as t WHERE t.ticket_type = ?', (ticket_type));
    return ticket[0];
};

exports.createTicket = async (ticketData) => {
    const {ticket_type, price} = ticketData;
    await db.query(
        'INSERT INTO ticket_type (ticket_type, price) VALUES (?, ?)',
        [ticket_type, price]
    );
};

exports.getAllTickets = async () => {
    const [tickets] = await db.query('SELECT * FROM ticket_type');
    return tickets;
};

exports.getTicketInfo = async () => {
    const [info] = await db.query(
        'SELECT ticket_type, price FROM ticket_type'
    );
    return info;
};

exports.getTicketByNum = async (num) => {
    const [ticket] = await db.query('SELECT * FROM ticket_type WHERE ticket_number = ?', [num]);
    return ticket[0];
};

exports.deleteAllTickets = async () => {
    await db.query('DELETE FROM ticket_type');
};

exports.deleteTicketByNum = async (num) => {
    await db.query('DELETE FROM ticket_type WHERE ticket_number = ?', [num]);
};