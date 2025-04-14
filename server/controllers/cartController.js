const cartModel = require('../models/cartModel.js');
const db = require('../config/db.js');

exports.getCartInfo = async (req, res) => {
    const { Visitor_ID } = req.query;
  
    if (!Visitor_ID) {
      return res.status(400).json({ error: 'Visitor_ID is required in query parameters.' });
    }
  
    try {
      const cartItems = await cartModel.getCartInfo(Visitor_ID);
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ error: 'No cart items found for this visitor.' });
      }
  
      return res.status(200).json({ message: 'Cart items retrieved successfully.', cart: cartItems });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving cart info.' });
    }
};

exports.addCartItem = async (req, res) => {
    const {
      Visitor_ID,
      Product_Type,
      Product_ID,
      Product_Name,
      Visit_Date,
      Quantity,
      Price
    } = req.body;
  
    console.log({ Visitor_ID, Product_Type, Product_ID, Product_Name, Quantity, Price });

    // Validate required fields
    if (!Visitor_ID || !Product_Type || !Product_ID || !Product_Name || !Quantity || !Price) {
      return res.status(400).json({ error: 'Missing required fields in request body.' });
    }
  
    try {
      const result = await cartModel.addCartItem({
        Visitor_ID,
        Product_Type,
        Product_ID,
        Product_Name,
        Visit_Date,
        Quantity,
        Price
      });
  
      return res.status(201).json({
        message: 'Item added to cart successfully.',
        cartId: result.insertId
      });
    } catch (err) {
      console.error('Add to Cart Error:', err);
      return res.status(500).json({ error: 'Failed to add item to cart. Check server.' });
    }
  };
  