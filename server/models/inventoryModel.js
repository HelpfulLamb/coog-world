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

exports.deleteAllInventory = async () => {
    await db.query('DELETE FROM inventory');
};

exports.deleteUnitById = async (id) => {
    await db.query('DELETE FROM inventory WHERE InventoryID = ?', [id]);
};

exports.getAllAvailableItems = async () => {
    const [merchandise] = await db.query(
        'SELECT i.Item_name, i.Item_shop_price, i.Item_desc, i.Item_type FROM items as i, inventory as s, kiosks as k WHERE i.Item_ID = s.Item_ID and k.Kiosk_ID = s.Kiosk_ID and k.Kiosk_operate = 1 and s.Item_quantity > 0 ORDER BY i.Item_ID'
    );
    return merchandise;
};