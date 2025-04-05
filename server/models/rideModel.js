const db = require('../config/db.js');

exports.findRideByName = async (name) => {
    const [ride] = await db.query('SELECT Ride_name FROM rides WHERE Ride_name = ?', [name])
    return ride[0];
}

exports.createRide = async (rideData) => {
    const {Ride_name, Ride_type, Ride_cost, Ride_staff} = rideData;
    const [result] = await db.query(
        'INSERT INTO rides (Ride_name, Ride_type, Ride_cost, Ride_staff) VALUES (?, ?, ?, ?)',
        [Ride_name, Ride_type, Ride_cost, Ride_staff]
    );
    return result.insertId;
};

exports.getAllRides = async () => {
    const [rides] = await db.query('SELECT * FROM rides');
    return rides;
};

exports.getRideInfo = async () => {
    const [info] = await db.query(
        'SELECT Ride_ID, Ride_name, Ride_type, Ride_maint, Ride_cost, Ride_staff, Is_operate, Ride_created FROM rides'
    );
    return info;
};

exports.getRideForCard = async () => {
    const [ride] = await db.query('SELECT r.Ride_name, r.Ride_type, s.area_name FROM rides as r, sectors as s WHERE r.Ride_loc = s.area_ID');
    return ride;
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
