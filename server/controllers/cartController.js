const cartModel = require('../models/cartModel.js');
const url = require('url');

exports.getCartInfo = async (req, res) => {
    const {query} = url.parse(req.url, true);
    const { Visitor_ID } = query;
    if (!Visitor_ID) {
        res.writeHead(400, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({ error: 'Visitor_ID is required in query parameters.' }));
    }
    try {
      const cartItems = await cartModel.getCartInfo(Visitor_ID);
      if (!cartItems || cartItems.length === 0) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'No cart items found for this visitor.' }));
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({ message: 'Cart items retrieved successfully.', cart: cartItems }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({ error: 'Error retrieving cart info.' }));
    }
};

exports.addCartItem = async (req, res, body) => {
    const {
      Visitor_ID,
      Product_Type,
      Product_ID,
      Product_Name,
      Visit_Date,
      Quantity,
      Price
    } = body;

    // Validate required fields
    if (!Visitor_ID || !Product_Type || !Product_ID || !Product_Name || !Quantity || !Price) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Missing required fields in request body.' }));
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
      res.writeHead(201, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({
        message: 'Item added to cart successfully.',
        cartId: result.insertId
      }));
    } catch (err) {
      console.error('Add to Cart Error:', err);
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({ error: 'Failed to add item to cart. Check server.' }));
    }
  };
  