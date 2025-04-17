const db = require('../config/db.js');

exports.findUserByEmail = async (email, phone) => {
    const [user] = await db.query('SELECT * FROM visitors WHERE email = ? OR phone = ?', [email, phone]);
    return user[0];
};

exports.createUsers = async (userData) => {
    const {first_name, last_name, email, password, phone, address} = userData;
    await db.query(
        'INSERT INTO visitors (First_name, Last_name, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, password, phone, address]
    );
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
    await db.query('DELETE FROM visitors WHERE Visitor_ID = ?', [id]);
};