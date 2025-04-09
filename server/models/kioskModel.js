const db = require('../config/db.js');

exports.createKiosk = async (userData) => {
    const {Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num} = userData;
    await db.query(
        'INSERT INTO kiosks (Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num) VALUES (?, ?, ?, ?, ?)',
        [Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num]
    );
};

exports.updateKiosk = async (selectedKiosk) => {
    const {Kiosk_ID, Kiosk_name, Kiosk_type, Kiosk_operate, Kiosk_loc, Staff_num, Kiosk_cost} = selectedKiosk;
    const [kiosk] = await db.query(
        'UPDATE kiosks SET Kiosk_name = ?, Kiosk_type = ?, Kiosk_operate = ?, Kiosk_loc = ?, Staff_num = ?, Kiosk_cost = ? WHERE Kiosk_ID = ?',
    [Kiosk_name, Kiosk_type, Kiosk_operate, Kiosk_loc, Staff_num, Kiosk_cost, Kiosk_ID]);
    return kiosk;
};

exports.getAllKiosks = async () => {
    const [kiosks] = await db.query('SELECT * FROM kiosks');
    return kiosks;
};

exports.getKioskInfo = async () => {
    const [info] = await db.query(
        'SELECT k.Kiosk_ID, k.Kiosk_name, k.Kiosk_type, k.Kiosk_cost, k.Kiosk_created, s.area_name FROM kiosks as k, sectors as s WHERE k.Kiosk_loc = s.area_ID');
    return info;
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

exports.deleteKioskById = async (kioskid) => {
    await db.query('DELETE FROM kiosks WHERE Kiosk_ID = ?', [kioskid]);
};
