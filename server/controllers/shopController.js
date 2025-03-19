const shopModel = require('../models/shopModel.js');

exports.createShop = async (req, res) => {
    try {
        const {name, location, open_time, close_time, type, cost, revenue, staffers, merch_type, merch_cost, merch_inv, merch_sold} = req.body;
        const shopId = await shopModel.createShop(name, location, open_time, close_time, type, cost, revenue, staffers, merch_type, merch_cost, merch_inv, merch_sold);
        res.status(201).json({id: shopId, name, location, open_time, close_time, type, cost, revenue, staffers, merch_type, merch_cost, merch_inv, merch_sold});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllShops = async (req, res) => {
    try {
        const shops = await shopModel.getAllShops();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getShopById = async (req, res) => {
    try {
        const shop = await shopModel.getShopById(req.params.id);
        if(!shop){
            return res.status(404).json({message: 'Shop not found'});
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllShops = async (req, res) => {
    try {
        await shopModel.deleteAllShops();
        res.status(200).json({message: 'All shops deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteShopById = async (req, res) => {
    try {
        await shopModel.deleteShopById(req.params.id);
        res.status(200).json({message: 'Shop deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};