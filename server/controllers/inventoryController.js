const inventoryModel = require('../models/inventoryModel.js');

exports.createUnit = async (req, res) => {
    try {
        const {item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level, created_date, created_by, last_updated, updated_by} = req.body;
        const inventoryId = await inventoryModel.createUnit(item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level, created_date, created_by, last_updated, updated_by);
        res.status(201).json({id: inventoryId, item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level, created_date, created_by, last_updated, updated_by});
    } catch (error) {
        res.status(500).json({message: error.message});
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

exports.getUnitById = async (req, res) => {
    try {
        const unit = await inventoryModel.getUnitById(req.params.id);
        if(!unit){
            return res.status(404).json({message: 'Unit not found'});
        }
        res.status(200).json(unit);
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

exports.deleteUnitById = async (req, res) => {
    try {
        await inventoryModel.deleteUnitById(req.params.id);
        res.status(200).json({message: 'Unit deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};