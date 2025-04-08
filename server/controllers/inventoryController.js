const inventoryModel = require('../models/inventoryModel.js');

exports.createAssignment = async (req, res) => {
    const {Kiosk_ID, Item_ID, Item_quantity, Restock_level} = req.body;
    if(!Kiosk_ID || !Item_ID || !Item_quantity || !Restock_level){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingAssignment = await inventoryModel.findAssignmentByID(Kiosk_ID, Item_ID);
        if(existingAssignment){
            return res.status(400).json({message: 'This item already exists in this kiosks stock. Please add a new item.'});
        }
        await inventoryModel.createAssignment({Kiosk_ID, Item_ID, Item_quantity, Restock_level});
        res.status(201).json({message: 'New Assignment Created Successfully.'});
    } catch (error) {
        console.error('Error adding new assignment: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.createItem = async (req, res) => {
    const {Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price} = req.body;
    if(!Item_type || !Item_name || !Item_desc || !Item_shop_price || !Item_supply_price){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingItem = await inventoryModel.findItemByName(Item_name);
        if(existingItem){
            return res.status(400).json({message: 'This item already exists. Please add a new item.'});
        }
        await inventoryModel.createItem({Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price});
        res.status(201).json({message: 'New Item Added Successfully.'});
    } catch (error) {
        console.error('Error adding new item: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.getAllInventory = async (req, res) => {
    try {
        const inv = await inventoryModel.getAllInventory();
        res.status(200).json(inv);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getInventoryInfo = async (req, res) => {
    try {
        const info = await inventoryModel.getInventoryInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await inventoryModel.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllInventory = async (req, res) => {
    try {
        await inventoryModel.deleteAllInventory();
        res.status(200).json({message: 'Whole inventory successfully deleted.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAssignmentById = async (req, res) => {
    try {
        const {Inventory_ID} = req.body;
        if(!Inventory_ID){
            return res.status(400).json({message: 'Invalid inventory ID provided.'});
        }
        await inventoryModel.deleteAssignmentById(Inventory_ID);
        res.status(200).json({message: 'Item assignment deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllAvailableItems = async (req, res) => {
    try {
        const merch = await inventoryModel.getAllAvailableItems();
        res.status(200).json(merch);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteItemById = async (req, res) => {
    try {
        const {Item_ID} = req.body;
        if(!Item_ID){
            return res.status(400).json({message: 'Invalid item id.'});
        }
        await inventoryModel.deleteItemById(Item_ID);
        res.status(200).json({message: 'Item deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};