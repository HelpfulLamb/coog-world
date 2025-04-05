const db = require('../config/db.js');

exports.createUnit = async (item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level, created_date, created_by, last_updated, updated_by) => {
    const [result] = await db.query(
        'INSERT INTO inventory (Item_type, Item_name, Item_quantity, Unit_price, Last_restocked_date, Reorder_level, Inventory_created, Inventory_created_by, Inventory_updated, Inventory_updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level, created_date, created_by, last_updated, updated_by]
    );
    return result.insertId;
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

exports.deleteAllInventory = async () => {
    await db.query('DELETE FROM inventory');
};

exports.deleteUnitById = async (id) => {
    await db.query('DELETE FROM inventory WHERE InventoryID = ?', [id]);
};

exports.getAllAvailableItems = async () => {
    const [merchandise] = await db.query(
        'SELECT Item_name, Item_shop_price, Item_desc FROM items WHERE Item_type = "shirt"'
    );
    return merchandise;
};
