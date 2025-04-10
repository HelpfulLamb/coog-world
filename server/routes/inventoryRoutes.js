const inventoryController = require('../controllers/inventoryController.js');
const express = require('express');
const inventoryRouter = express.Router();


/*Inventory Structure*/
// create new items
inventoryRouter.post('/create-assignment', inventoryController.createAssignment);
inventoryRouter.post('/create-item', inventoryController.createItem);

// update existing items and assignments
inventoryRouter.put('/items/:id', inventoryController.updateItem);

// retrieve inventory (all or specific)
inventoryRouter.get('/all', inventoryController.getAllInventory);
inventoryRouter.get('/info', inventoryController.getInventoryInfo);
inventoryRouter.get('/merchandise', inventoryController.getAllAvailableItems);
inventoryRouter.get('/items', inventoryController.getAllItems);

// delete items (all or specific)
inventoryRouter.delete('/delete-all', inventoryController.deleteAllInventory);
inventoryRouter.delete('/delete-selected', inventoryController.deleteAssignmentById);
inventoryRouter.delete('/delete-selected-item', inventoryController.deleteItemById);

inventoryRouter.post('/purchase', inventoryController.purchaseMerch);
inventoryRouter.get('/shop-purchases/:visitorId', inventoryController.getVisitorPurchases);

module.exports = {
    inventoryRouter
}