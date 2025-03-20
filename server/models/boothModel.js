const db = require('../config/db.js');

exports.createBooth = async (name, location, start_time, end_time, cost, revenue, staffers, status) => {
    const [result] = await db.query(
        'INSERT INTO booths (Booth_name, Booth_loc, Booth_start, Booth_end, Booth_cost, Booth_rev, Staff_num, Is_operate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, location, start_time, end_time, cost, revenue, staffers, status]
    );
    return result.insertId;
};

exports.getAllBooths = async () => {
    const [booths] = await db.query('SELECT * FROM booths');
    return booths;
};

exports.getBoothById = async (id) => {
    const [booth] = await db.query('SELECT * FROM booths WHERE Booth_ID = ?', [id]);
    return booth[0];
};

exports.deleteAllBooths = async () => {
    await db.query('DELETE FROM booths');
};

exports.deleteBoothById = async (id) => {
    await db.query('DELETE FROM booths WHERE Booth_ID = ?', [id]);
};