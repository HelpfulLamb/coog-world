const { getInventory } = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();

inventoryRouter.get('/', getInventory);

module.exports = {
    inventoryRouter
}