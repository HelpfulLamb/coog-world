const inventoryModel = require('../models/inventoryModel.js');
const db = require('../config/db');

exports.createAssignment = async (req, res, body) => {
    const { Kiosk_ID, Item_ID, Item_quantity, Restock_level } = body;
    if (!Kiosk_ID || !Item_ID || !Item_quantity || !Restock_level) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'All fields are required! Somethings missing.' }));
    }
    try {
        const existingAssignment = await inventoryModel.findAssignmentByID(Kiosk_ID, Item_ID);
        if (existingAssignment) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'This item already exists in this kiosks stock. Please add a new item.' }));
        }
        await inventoryModel.createAssignment({ Kiosk_ID, Item_ID, Item_quantity, Restock_level });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'New Assignment Created Successfully.' }));
    } catch (error) {
        console.error('Error adding new assignment: ', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred. Please try again.' }));
    }
};

exports.createItem = async (req, res, body) => {
    const { Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price } = body;
    if (!Item_type || !Item_name || !Item_desc || !Item_shop_price || !Item_supply_price) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'All fields are required! Somethings missing.' }));
    }
    try {
        const existingItem = await inventoryModel.findItemByName(Item_name, Item_desc);
        if (existingItem) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'This item already exists. Please add a new item.' }));
        }
        await inventoryModel.createItem({ Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'New Item Added Successfully.' }));
    } catch (error) {
        console.error('Error adding new item: ', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred. Please try again.' }));
    }
};

exports.updateItem = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedItem = { ...updatedData, Item_ID: id };
        const updatedItem = await inventoryModel.updateItem(selectedItem);
        if (!updatedItem) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Item not found or not updated.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item updated successfully.', item: updatedData }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.restockItem = async (req, res, id, body) => {
    try {
        const { restockAmount } = body;
        if (!restockAmount || isNaN(restockAmount)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid restock amount.' }));
        }
        
        const currentItem = await inventoryModel.getRestockLevel(id);
        if (!currentItem) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Entry not found.' }));
        }
        const newRestockLevel = parseInt(currentItem.Item_quantity, 10) + parseInt(restockAmount, 10);
        const updatedItem = await inventoryModel.restockItem(newRestockLevel, id);
        if (!updatedItem) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Failed to restock item.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item restocked successfully.', item: updatedItem }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.markMessageSeen = async (req, res, id) => {
    try {
        await inventoryModel.markMessageSeen(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Low stock alert acknowledged.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getInvStockAlerts = async (req, res) => {
    try {
        const message = await inventoryModel.getInvStockAlerts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message || []));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getAllInventory = async (req, res) => {
    try {
        const inv = await inventoryModel.getAllInventory();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(inv));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getInventoryInfo = async (req, res) => {
    try {
        const info = await inventoryModel.getInventoryInfo();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await inventoryModel.getAllItems();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getInventoryTotalCost = async (req, res) => {
    try {
        const inventory = await inventoryModel.getInventoryCosts();
        if (!inventory) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Inventory not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(inventory));
    } catch (err) {
        console.error('Error fetching inventory:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching inventory' }));
    }
};

exports.deleteAllInventory = async (req, res) => {
    try {
        await inventoryModel.deleteAllInventory();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Whole inventory successfully deleted.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.deleteAssignmentById = async (req, res, body) => {
    try {
        const { Inventory_ID } = body;
        if (!Inventory_ID) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid inventory ID provided.' }));
        }
        await inventoryModel.deleteAssignmentById(Inventory_ID);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item assignment deleted successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getAllAvailableItems = async (req, res) => {
    try {
        const merch = await inventoryModel.getAllAvailableItems();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(merch));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.deleteItemById = async (req, res, body) => {
    try {
        const { Item_ID } = body;
        if (!Item_ID) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid item id.' }));
        }
        await inventoryModel.deleteItemById(Item_ID);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item deleted successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.purchaseMerch = async (req, res, body) => {
    const { user_id, item_id, price, quantity, quantity_sold, total_amount, product_type, payment_method } = body;
    try {
        if (product_type === 'Merchandise' && payment_method === 'pay_at_store') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Merchandise cannot be paid at store.' }));
        }
        
        const [transaction] = await db.query(
            `INSERT INTO transactions (Visitor_ID, Total_amount) VALUES (?, ?)`,
            [user_id, total_amount]
        );
        const transactionId = transaction.insertId;
        
        await db.query(`
            INSERT INTO product_purchases 
            (Transaction_ID, product_id, product_type, purchase_price, quantity_sold, quantity, total_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [transactionId, item_id, product_type, price, quantity_sold, quantity, total_amount]
        );
        
        await db.query(
            `UPDATE inventory
             SET Item_quantity = Item_quantity - ?
             WHERE Inventory_ID = ?`,
            [quantity_sold, item_id]
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Merchandise purchase successful!' }));
    } catch (err) {
        console.error('Error processing merch purchase:', err.message, err.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error processing purchase.', error: err.message }));
    }
};

exports.getVisitorPurchases = async (req, res, id) => {
    try {
        const [rows] = await db.query(`
        SELECT 
          it.Item_name AS item,
          pp.quantity AS quantity,                  
          pp.purchase_price AS unit_price,         
          pp.total_amount AS total_price,          
          pp.purchase_created AS date
        FROM product_purchases pp
        JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
        JOIN inventory i ON pp.product_id = i.Inventory_ID
        JOIN items it ON i.Item_ID = it.Item_ID
        WHERE t.Visitor_ID = ?
        ORDER BY pp.purchase_created DESC
      `, [id]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ purchases: rows }));
    } catch (err) {
        console.error("Error fetching shop purchases:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Failed to fetch shop purchases" }));
    }
};  