const db = require('../config/db.js');

exports.createShop = async (name, location, open_time, close_time, type, cost, staffers, merch_sold) => {
    const [result] = await db.query(
        'INSERT INTO shops (Shop_name, shop_location, Shop_open, Shop_close, Shop_type, Shop_cost, Staff_num, Merch_sold) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, location, open_time, close_time, type, cost, staffers, merch_sold]
    );
    return result.insertId;
};

exports.getAllShops = async () => {
    const [shops] = await db.query('SELECT * FROM shops');
    return shops;
};

exports.getShopById = async (id) => {
    const [shop] = await db.query('SELECT * FROM shops WHERE Shop_ID = ?', [id]);
    return shop[0];
};

exports.deleteAllShops = async () => {
    await db.query('DELETE FROM shops');
};

exports.deleteShopById = async (id) => {
    await db.query('DELETE FROM shops WHERE Shop_ID = ?', [id]);
};