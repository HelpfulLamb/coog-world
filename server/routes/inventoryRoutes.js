const inventoryController = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();

/*Inventory Structure*/
// create new rides
inventoryRouter.post('/', inventoryController.createUnit);

// retrieve rides (all or specific)
inventoryRouter.get('/all', inventoryController.getAllInventory);
inventoryRouter.get('/merchandise', inventoryController.getAllAvailableItems);

// delete rides (all or specific)
inventoryRouter.delete('/', inventoryController.deleteAllInventory);
inventoryRouter.delete('/:id', inventoryController.deleteUnitById);

module.exports = {
    inventoryRouter
}