const db = require('../config/db.js');

exports.findItemByName = async (name) => {
    const [item] = await db.query('SELECT * FROM items WHERE Item_name = ?', [name]);
    return item[0];
};

exports.findAssignmentByID = async (kiosk, item) => {
    const [assignment] = await db.query(`SELECT Kiosk_ID, Item_ID FROM inventory WHERE Kiosk_ID = ${kiosk} and Item_ID = ${item}`);
    return assignment[0];
};

exports.createAssignment = async (assignmentData) => {
    const {Kiosk_ID, Item_ID, Item_quantity, Restock_level} = assignmentData;
    await db.query(
        'INSERT INTO inventory (Kiosk_ID, Item_ID, Item_quantity, Restock_level) VALUES (?, ?, ?, ?)',
        [Kiosk_ID, Item_ID, Item_quantity, Restock_level]
    );
};

exports.createItem = async (itemData) => {
    const {Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price} = itemData;
    await db.query(
        'INSERT INTO items (Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price) VALUES (?, ?, ?, ?, ?)',
        [Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price]
    );
};

exports.getAllInventory = async () => {
    const [inventory] = await db.query('SELECT * FROM inventory');
    return inventory;
};

exports.getInventoryInfo = async () => {
    const [info] = await db.query(
        'SELECT t.Item_ID, t.Item_name, t.Item_type, t.Item_shop_price, t.Item_supply_price, i.Item_quantity, k.Kiosk_name FROM inventory as i, items as t, kiosks as k WHERE i.Item_ID = t.Item_ID and i.Kiosk_ID = k.Kiosk_ID'
    );
    return info;
};

exports.getAllItems = async () => {
    const [items] = await db.query(
        'SELECT Item_ID, Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price, Item_created FROM items');
    return items;
};

exports.deleteAllInventory = async () => {
    await db.query('DELETE FROM inventory');
};

exports.deleteUnitById = async (id) => {
    await db.query('DELETE FROM inventory WHERE InventoryID = ?', [id]);
};

exports.getAllAvailableItems = async () => {
    const [merchandise] = await db.query(
        'SELECT Item_name, Item_shop_price, Item_desc FROM items'
    );
    return merchandise;
};
