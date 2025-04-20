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

exports.updateVisitorInfo = async (selectedUser) => {
    const {Visitor_ID, First_name, Last_name, Email, Phone, Address} = selectedUser;
    const [user] = await db.query('UPDATE visitors SET First_name = ?, Last_name = ?, Email = ?, Phone = ?, Address = ? WHERE Visitor_ID = ?',
        [First_name, Last_name, Email, Phone, Address, Visitor_ID]
    );
    return user;
};

exports.getAllUsers = async () => {
    const [users] = await db.query('SELECT * FROM visitors');
    return users;
};

exports.getUserInfo = async () => {
    const [info] = await db.query('SELECT Visitor_ID, First_name, Last_name, Email, Phone, Address FROM visitors');
    return info;
};

exports.getUserById = async (id) => {
    const [user] = await db.query('SELECT * FROM visitors WHERE Visitor_ID = ?', [id]);
    return user[0];
};

exports.deleteAllUsers = async () => {
    await db.query('DELETE FROM visitors');
};

exports.deleteUserById = async (userid) => {
    await db.query('DELETE FROM visitors WHERE Visitor_ID = ?', [userid]);
};