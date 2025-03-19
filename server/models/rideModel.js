const db = require('../config/db.js');

exports.createRide = async (name, type, maintenance_date, cost, operators, status) => {
    const [result] = await db.query(
        'INSERT INTO rides (Ride_name, Ride_type, Ride_maint, Ride_cost, Ride_op, Is_operate) VALUES (?, ?, ?, ?, ?, ?)',
        [name, type, maintenance_date, cost, operators, status]
    );
    return result.insertId;
};

exports.getAllRides = async () => {
    const [rides] = await db.query('SELECT * FROM rides');
    return rides;
};

exports.getRideById = async (id) => {
    const [ride] = await db.query('SELECT * FROM rides WHERE Ride_ID = ?', [id]);
    return ride[0];
};

exports.deleteAllRides = async () => {
    await db.query('DELETE FROM rides');
};

exports.deleteRideById = async (id) => {
    await db.query('DELETE FROM rides WHERE Ride_ID = ?', [id]);
};