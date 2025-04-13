const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController.js');

//get a user's cart
cartRouter.get('/info', cartController.getCartInfo);

//Add Item to user's cart
cartRouter.post('/add-item', cartController.addCartItem);

//Delete user's entire cart
//cartRouter.delete('/delete-all', cartController.deleteCart);
//Delete selected item by user
//cartRouter.delete('/delete-selected', cartController.deleteCartSpecific);

//Modify user's item
//cartRouter.put('/:id', cartController.updateQuantity);

module.exports = {
    cartRouter
}