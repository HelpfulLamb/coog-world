const db = require('../config/db.js');

exports.getCartInfo = async (Visitor_ID) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM shopping_cart WHERE Visitor_ID = ?',
        [Visitor_ID]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      throw error;
    }
};

exports.addCartItem = async ({
    Visitor_ID,
    Product_Type,
    Product_ID,
    Product_Name,
    Visit_Date,
    Quantity,
    Price
  }) => {
    try {
      const [result] = await db.execute(
        `INSERT INTO shopping_cart 
          (Visitor_ID, Product_Type, Product_ID, Product_Name, Visit_Date, Quantity, Price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [Visitor_ID, Product_Type, Product_ID, Product_Name, Visit_Date, Quantity, Price]
      );
  
      return result;
    } catch (error) {
      console.error('Error inserting cart item: Check server model.', error);
      throw error;
    }
  };
