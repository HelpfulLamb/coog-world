const inventoryController = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();

/*Inventory Structure*/
// create new items
inventoryRouter.post('/', inventoryController.createUnit);

// retrieve inventory (all or specific)
inventoryRouter.get('/all', inventoryController.getAllInventory);
inventoryRouter.get('/info', inventoryController.getInventoryInfo);
inventoryRouter.get('/merchandise', inventoryController.getAllAvailableItems);

// delete items (all or specific)
inventoryRouter.delete('/', inventoryController.deleteAllInventory);
inventoryRouter.delete('/:id', inventoryController.deleteUnitById);

module.exports = {
    inventoryRouter
}