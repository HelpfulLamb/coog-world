const shopController = require('../controllers/shopController.js');
const express = require('express');
const shopRouter = express.Router();

// create new shops
shopRouter.post('/', shopController.createShop);

// retrieve shops (all or specific)
shopRouter.get('/', shopController.getAllShops);
shopRouter.get('/:id', shopController.getShopById);

// delete shops (all or specific)
shopRouter.delete('/', shopController.deleteAllShops);
shopRouter.delete('/:id', shopController.deleteShopById);


module.exports = {
    shopRouter
}