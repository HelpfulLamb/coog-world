const db = require('../config/db.js');

exports.findItemByName = async (name, desc) => {
    const [item] = await db.query('SELECT * FROM items WHERE Item_name = ? and Item_desc = ?', [name, desc]);
    return item[0];
};

exports.findAssignmentByID = async (kiosk, item) => {
    const [assignment] = await db.query(`SELECT Kiosk_ID, Item_ID FROM inventory WHERE Kiosk_ID = ${kiosk} and Item_ID = ${item}`);
    return assignment[0];
};

exports.createAssignment = async (assignmentData) => {
    const { Kiosk_ID, Item_ID, Item_quantity, Restock_level } = assignmentData;
    await db.query(
        'INSERT INTO inventory (Kiosk_ID, Item_ID, Item_quantity, Restock_level) VALUES (?, ?, ?, ?)',
        [Kiosk_ID, Item_ID, Item_quantity, Restock_level]
    );
};

exports.createItem = async (itemData) => {
    const { Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price } = itemData;
    await db.query(
        'INSERT INTO items (Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price) VALUES (?, ?, ?, ?, ?)',
        [Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price]
    );
};

exports.updateItem = async (selectedItem) => {
    const { Item_ID, Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price } = selectedItem;
    const [item] = await db.query(
        'UPDATE items SET Item_type = ?, Item_name = ?, Item_desc = ?, Item_shop_price = ?, Item_supply_price = ? WHERE Item_ID = ?',
        [Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price, Item_ID]);
    return item;
};

exports.restockItem = async (newRestockLevel, Inventory_ID) => {
    const [result] = await db.query(
        'UPDATE inventory SET Item_quantity = ? WHERE Inventory_ID = ?',
        [newRestockLevel, Inventory_ID]
    );
    return result;
};

exports.getRestockLevel = async (Inventory_ID) => {
    const [rows] = await db.query(
        'SELECT Item_quantity FROM inventory WHERE Inventory_ID = ?',
        [Inventory_ID]
    );
    return rows[0]; 
};

exports.markMessageSeen = async (alertID) => {
    await db.query('UPDATE restock_notifications SET Is_Seen = TRUE WHERE Notification_ID = ?', [alertID]);
};

exports.getInvStockAlerts = async () => {
    const [alert] = await db.query('SELECT * FROM restock_notifications WHERE Is_Seen = FALSE ORDER BY Created_At DESC');
    return alert;
};

exports.getAllInventory = async () => {
    const [inventory] = await db.query('SELECT * FROM inventory');
    return inventory;
};

exports.getInventoryInfo = async () => {
    const [info] = await db.query(
        'SELECT i.Inventory_ID, t.Item_ID, t.Item_name, t.Item_type, t.Item_shop_price, t.Item_supply_price, i.Item_quantity, k.Kiosk_name FROM inventory as i, items as t, kiosks as k WHERE i.Item_ID = t.Item_ID and i.Kiosk_ID = k.Kiosk_ID'
    );
    return info;
};

exports.getAllItems = async () => {
    const [items] = await db.query(
        'SELECT Item_ID, Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price, Item_created FROM items');
    return items;
};

exports.getInventoryCosts = async () => {
    const query = `
        SELECT t.Item_name, t.Item_type, t.Item_supply_price, SUM(i.Item_quantity) AS Total_Quantity
        FROM inventory AS i
        JOIN items AS t ON i.Item_ID = t.Item_ID
        GROUP BY t.Item_name, t.Item_type, t.Item_supply_price;`;

    try {
        const [results] = await db.query(query);
        return results;
    } catch (err) {
        throw new Error('Error fetching inventory: ' + err.message);
    }
};

exports.deleteAllInventory = async () => {
    await db.query('DELETE FROM inventory');
};

exports.deleteAssignmentById = async (invid) => {
    await db.query('DELETE FROM inventory WHERE Inventory_ID = ?', [invid]);
};

exports.getAllAvailableItems = async () => {
    const [items] = await db.query(`
      SELECT 
        i.Inventory_ID,
        it.Item_ID,
        it.Item_name,
        it.Item_desc,
        it.Item_shop_price,
        i.Item_quantity
      FROM 
        inventory as i
      JOIN 
        items as it ON i.Item_ID = it.Item_ID
    `);
    return items;
};

exports.deleteItemById = async (itemid) => {
    await db.query('DELETE FROM items WHERE Item_ID = ?', [itemid]);
};
