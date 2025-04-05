const inventoryController = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();

/*Inventory Structure*/
// create new items
inventoryRouter.post('/create-assignment', inventoryController.createAssignment);
inventoryRouter.post('/create-item', inventoryController.createItem);

// retrieve inventory (all or specific)
inventoryRouter.get('/all', inventoryController.getAllInventory);
inventoryRouter.get('/info', inventoryController.getInventoryInfo);
inventoryRouter.get('/merchandise', inventoryController.getAllAvailableItems);
inventoryRouter.get('/items', inventoryController.getAllItems);

// delete items (all or specific)
inventoryRouter.delete('/', inventoryController.deleteAllInventory);
inventoryRouter.delete('/:id', inventoryController.deleteUnitById);

module.exports = {
    inventoryRouter
}