const ticketModel = require('../models/ticketModel.js');
const db = require('../config/db');

exports.createTicket = async (req, res, body) => {
    const { ticket_type, price } = body;
    if (!ticket_type || !price) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'All fields are required!'}));
    }
    try {
        const existingTicket = await ticketModel.findTicketByName(ticket_type);
        if (existingTicket) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'A ticket with that name already exists.'}));
        }
        await ticketModel.createTicket({ ticket_type, price });
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Ticket created successfully'}));
    } catch (error) {
        console.error('Error adding new ticket: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'An error occurred. Please try again.'}));
    }
};

exports.updateTicket = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedTicket = {...updatedData, ticket_id: id};
        const updatedTicket = await ticketModel.updateTicket(selectedTicket);
        if(!updatedTicket){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Ticket not found or not updated.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Ticket updated successfully.', ticket: updatedData}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(tickets));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getTicketInfo = async (req, res) => {
    try {
        const info = await ticketModel.getTicketInfo();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getTicketByNum = async (req, res, num) => {
    try {
        const ticket = await ticketModel.getTicketByNum(num);
        if (!ticket) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Ticket not found'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(ticket));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteAllTickets = async (req, res) => {
    try {
        await ticketModel.deleteAllTickets();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All tickets deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteTicketById = async (req, res, body) => {
    try {
      const {ticket_id} = body;
      if(!ticket_id){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Invalid ticket id.'}));
      }
        await ticketModel.deleteTicketById(ticket_id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Ticket deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.purchaseTicket = async (req, res, body) => {
    try {
        let { user_id, Visitor_ID, ticket_id, quantity, price, total_amount } = body;
        const visitorId = user_id || Visitor_ID;
        if (!visitorId || !ticket_id || !quantity) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Missing Visitor_ID, ticket_id, or quantity'}));
        }
        if (!price) {
            const [ticket] = await db.query(
                'SELECT price FROM ticket_type WHERE ticket_id = ?',
                [ticket_id]
            );
            if (!ticket || !ticket[0]) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: 'Ticket not found'}));
            }
            price = ticket[0].price;
        }
        const total = total_amount || price * quantity;
        const [transactionResult] = await db.query(
            'INSERT INTO transactions (Visitor_ID, transaction_date) VALUES (?, NOW())',
            [visitorId]
        );
        const transactionId = transactionResult.insertId;
        await db.query(
        `INSERT INTO product_purchases 
            (Transaction_ID, product_id, product_type, quantity_sold, purchase_price, total_amount, visit_date) 
            VALUES (?, ?, 'Ticket', ?, ?, ?, ?)`,
        [transactionId, ticket_id, quantity, price, total, body.visit_date]
    );    
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
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: true, message: 'Ticket purchase recorded.'}));
    } catch (err) {
        console.error('Purchase error:', err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Purchase failed', error: err.message}));
    }
};

exports.getUserTicketPurchases = async (req, res, id) => {
    try {
        const [purchases] = await db.query(`
        SELECT 
        tt.ticket_type AS type,
        pp.quantity_sold AS quantity,
        pp.visit_date AS date,
        pp.total_amount AS total
        FROM product_purchases pp
        JOIN ticket_type tt ON pp.product_id = tt.ticket_id
        JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
        WHERE t.Visitor_ID = ?
        AND pp.product_type = 'Ticket'
        ORDER BY pp.purchase_created DESC
        `, [id]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ tickets: purchases }));
    } catch (error) {
        console.error('Error fetching ticket purchases:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'An error occurred while fetching ticket purchases.'}));
    }
};