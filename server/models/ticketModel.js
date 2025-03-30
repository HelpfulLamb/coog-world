const db = require('../config/db.js');

exports.createTicket = async (type, price) => {
    const [result] = await db.query(
        'INSERT INTO ticket_type (ticket_type, price) VALUES (?, ?)',
        [type, price]
    );
    return result.insertId;
};

exports.getAllTickets = async () => {
    const [tickets] = await db.query('SELECT * FROM ticket_type');
    return tickets;
};

exports.getTicketInfo = async () => {
    const [info] = await db.query(
        'SELECT ticket_id, ticket_type, price FROM ticket_type'
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