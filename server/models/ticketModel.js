const db = require('../config/db.js');

exports.findTicketByName = async (ticket_type) => {
    const [ticket] = await db.query(
        'SELECT t.ticket_type FROM ticket_type AS t WHERE t.ticket_type = ?',
        [ticket_type]
    );
    return ticket[0];
};

exports.createTicket = async (ticketData) => {
    const {ticket_type, price} = ticketData;
    await db.query(
        'INSERT INTO ticket_type (ticket_type, price) VALUES (?, ?)',
        [ticket_type, price]
    );
};

exports.updateTicket = async (selectedTicket) => {
    const {ticket_id, ticket_type, price} = selectedTicket;
    const [ticket] = await db.query(
        'UPDATE ticket_type SET ticket_type = ?, price = ? WHERE ticket_id = ?', 
        [ticket_type, price, ticket_id]);
    return ticket;
};

exports.getAllTickets = async () => {
    const [tickets] = await db.query('SELECT * FROM ticket_type');
    return tickets;
};

exports.getTicketInfo = async () => {
    const [info] = await db.query(
        'SELECT ticket_id, ticket_type, price FROM ticket_type');
    return info;
};

exports.getTicketByNum = async (num) => {
    const [ticket] = await db.query('SELECT * FROM ticket_type WHERE ticket_id = ?', [num]);
    return ticket[0];
};

exports.deleteAllTickets = async () => {
    await db.query('DELETE FROM ticket_type');
};

exports.deleteTicketById = async (ticketid) => {
    await db.query('DELETE FROM ticket_type WHERE ticket_id = ?', [ticketid]);
};

exports.purchaseTicket = async (userId, ticketId, price, quantity) => {
    const [result] = await db.query(
        `INSERT INTO tickets_purchases 
        (user_id, ticket_id, Tick_quantity_sold, Tick_purchase_price)
        VALUES (?, ?, ?, ?)`,
        [userId, ticketId, quantity, price]
    );
    return { id: result.insertId };
};

