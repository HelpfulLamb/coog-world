const db = require('../config/db.js');

exports.createBooth = async (userData) => {
    const {name, type, operational, location, staffers, cost, date_created, created_by, date_updated, updated_by} = userData;
    await db.query(
        'INSERT INTO kiosks (Kiosk_name, Kiosk_type, Kiosk_operate, Kiosk_loc, Staff_num, Kiosk_cost, Kiosk_created, Kiosk_created_by, Kiosk_updated, Kiosk_updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, type, operational, location, staffers, cost, date_created, created_by, date_updated, updated_by]
    );
};

exports.getAllKiosks = async () => {
    const [kiosks] = await db.query('SELECT * FROM kiosks');
    return kiosks;
};

exports.getAllMerchShops = async () => {
    const [merchShops] = await db.query(
        "SELECT k.Kiosk_name, s.area_name FROM kiosks as k, sectors as s WHERE k.Kiosk_type = 'Merch' and k.Kiosk_operate = 1 and s.area_ID = k.Kiosk_loc ");
    return merchShops;
};

exports.getAllBooths = async () => {
    const [booths] = await db.query("SELECT * FROM kiosks WHERE Kiosk_type = 'Game' ");
    return booths;
};

exports.getAllFoodShops = async () => {
    const [foodShops] = await db.query("SELECT * FROM kiosks WHERE Kiosk_type = 'Food' ");
    return foodShops;
};

exports.getKioskById = async (id) => {
    const [kiosk] = await db.query('SELECT * FROM kiosks WHERE Kiosk_ID = ?', [id]);
    return kiosk[0];
};

exports.deleteAllKiosks = async () => {
    await db.query('DELETE FROM kiosks');
};

exports.deleteKioskById = async (id) => {
    await db.query('DELETE FROM kiosks WHERE Kiosk_ID = ?', [id]);
};