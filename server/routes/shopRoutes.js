const { getShops } = require('../controllers/shopController.js');
const express = require('express');
const shopRouter = express.Router();

shopRouter.get('/', getShops);

module.exports = {
    shopRouter
}