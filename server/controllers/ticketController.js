const ticketModel= require('../models/ticketModel.js');
const db = require('../config/db');

exports.createTicket = async (req, res) => {
    const {ticket_type, price} = req.body;
    console.log('Request Body: ', req.body);
    if(!ticket_type || !price){
        return res.status(400).json({message: 'All fields are required!'});
    }
    try {
        const existingTicket = await ticketModel.findTicketByName(ticket_type);
        if(existingTicket){
            return res.status(400).json({message: 'A ticket with that name already exists. Please try again.'});
        }
        await ticketModel.createTicket({ticket_type, price});
        res.status(201).json({message: 'Ticket created successfully'});
    } catch (error) {
        console.error('Error adding new ticket: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.getAllTickets = async (req, res) => {
    try {
      const tickets = await ticketModel.getAllTickets();
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getTicketInfo = async (req, res) => {
    try {
        const info = await ticketModel.getTicketInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getTicketByNum = async (req, res) => {
    try {
        const ticket = await ticketModel.getTicketByNum(req.params.num);
        if(!ticket){
            return res.status(404).json({message: 'Ticket not found'});
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllTickets = async (req, res) => {
    try {
        await ticketModel.deleteAllTickets();
        res.status(200).json({message: 'All tickets deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteTicketById = async (req, res) => {
    try {
      const {ticket_id} = req.body;
      if(!ticket_id){
        return res.status(400).json({message: 'Invalid ticket id.'});
      }
        await ticketModel.deleteTicketById(ticket_id);
        res.status(200).json({message: 'Ticket deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.purchaseTicket = async (req, res) => {
    try {
      let { user_id, ticket_id, quantity, price, total_amount } = req.body;
  
      if (!user_id || !ticket_id || !quantity) {
        return res.status(400).json({ message: 'Missing user_id, ticket_id, or quantity' });
      }
  
      if (!price) {
        const [ticket] = await db.query(
          'SELECT price FROM ticket_type WHERE ticket_id = ?',
          [ticket_id]
        );
        if (!ticket || !ticket[0]) {
          return res.status(404).json({ message: 'Ticket not found' });
        }
        price = ticket[0].price;
      }
  
      const total = total_amount || price * quantity;
  
      const [transactionResult] = await db.query(
        'INSERT INTO transactions (Visitor_ID, transaction_date) VALUES (?, NOW())',
        [user_id]
      );
      const transactionId = transactionResult.insertId;
  
      await db.query(
        `INSERT INTO product_purchases 
         (Transaction_ID, product_id, product_type, quantity_sold, purchase_price, total_amount) 
         VALUES (?, ?, 'Ticket', ?, ?, ?)`,
        [transactionId, ticket_id, quantity, price, total]
      );
  
      // update the total in transactions table
      await db.query(
        `UPDATE transactions 
         SET Total_amount = (
           SELECT SUM(total_amount) 
           FROM product_purchases 
           WHERE Transaction_ID = ?
         )
         WHERE Transaction_ID = ?`,
        [transactionId, transactionId]
      );
  
      res.status(200).json({ success: true, message: 'Ticket purchase recorded.' });
    } catch (err) {
      console.error('Purchase error:', err);
      res.status(500).json({ message: 'Purchase failed', error: err.message });
    }
  };    

exports.getUserTicketPurchases = async (req, res) => {
    const userId = req.params.userId;

    try {
        const [purchases] = await db.query(`
            SELECT 
                tt.ticket_type AS type,
                pp.quantity_sold AS quantity,
                pp.purchase_created AS date
            FROM product_purchases pp
            JOIN ticket_type tt ON pp.product_id = tt.ticket_id
            JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
            WHERE t.Visitor_ID = ?
              AND pp.product_type = 'Ticket'
            ORDER BY pp.purchase_created DESC
        `, [userId]);
        

        res.status(200).json({ tickets: purchases });
    } catch (error) {
        console.error('Error fetching ticket purchases:', error);
        res.status(500).json({ message: 'An error occurred while fetching ticket purchases.' });
    }
};