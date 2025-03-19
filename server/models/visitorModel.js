const db = require('../config/db.js');

exports.createUsers = async (fname, lname, email, phone, address, purchased_tickets, ticket_type) => {
    const [result] = await db.query(
        'INSERT INTO visitors (First_name, Last_name, Email, Phone, Address, Tickets_purchased, Ticket_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [fname, lname, email, phone, address, purchased_tickets, ticket_type]
    );
    return result.insertId;
};

exports.getAllUsers = async () => {
    const [users] = await db.query('SELECT * FROM visitors');
    return users;
};

exports.getUserById = async (id) => {
    const [user] = await db.query('SELECT * FROM visitors WHERE Visitor_ID = ?', [id]);
    return user[0];
};

exports.deleteAllUsers = async () => {
    await db.query('DELETE FROM visitors');
};

exports.deleteUserById = async (id) => {
    await db.query('DELETE FROM visitor WHERE Visitor_ID = ?', [id])
};