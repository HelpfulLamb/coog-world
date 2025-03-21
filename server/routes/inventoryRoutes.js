const inventoryController = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();

// create new rides
inventoryRouter.post('/', inventoryController.createUnit);

// retrieve rides (all or specific)
inventoryRouter.get('/', inventoryController.getAllInventory);
inventoryRouter.get('/:id', inventoryController.getUnitById);

// delete rides (all or specific)
inventoryRouter.delete('/', inventoryController.deleteAllInventory);
inventoryRouter.delete('/:id', inventoryController.deleteUnitById);


module.exports = {
    inventoryRouter
}