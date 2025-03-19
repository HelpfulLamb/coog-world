const db = require('../config/db.js');

exports.createShow = async (name, cost, start_time, end_time, location, capacity, performers, staffers, maintenance_date, status) => {
    const [result] = await db.query(
        'INSERT INTO shows (Show_name, Show_cost, Show_start, Show_end, Stage_location, Seat_num, Perf_num, Staff_num, Stage_maint, Is_operate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, cost, start_time, end_time, location, capacity, performers, staffers, maintenance_date, status]
    );
    return result.insertId;
};

exports.getAllShows = async () => {
    const [shows] = await db.query('SELECT * FROM shows');
    return shows;
};

exports.getShowById = async (id) => {
    const [show] = await db.query('SELECT * FROM shows WHERE Show_ID = ?', [id]);
    return show[0];
};

exports.deleteAllShows = async () => {
    await db.query('DELETE FROM shows');
};

exports.deleteShowById = async (id) => {
    await db.query('DELETE FROM shows WHERE Show_ID = ?', [id]);
};