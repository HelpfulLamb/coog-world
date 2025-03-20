const db = require('../config/db.js');

exports.createService = async (type, cost, staffers, assigned_staffer, int_use) => {
    const [result] = await db.query(
        'INSERT INTO services (Rent_type, Rent_cost, Staff_num, Staff_assign, Internet_use) VALUES (?, ?, ?, ?, ?)',
        [type, cost, staffers, assigned_staffer, int_use]
    );
    return result.insertId;
};

exports.getAllServices = async () => {
    const [services] = await db.query('SELECT * FROM services');
    return services;
};

exports.getServiceById = async (id) => {
    const [service] = await db.query('SELECT * FROM services WHERE Rent_type = ?', [id]);
    return service[0];
};

exports.deleteAllServices = async () => {
    await db.query('DELETE FROM services');
};

exports.deleteServiceById = async (id) => {
    await db.query('DELETE FROM services WHERE Rent_type = ?', [id]);
};