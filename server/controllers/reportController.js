const reportModel = require('../models/reportModel.js');
const db = require('../config/db.js');

exports.getRainoutsReport = async (req, res) => {
  try {
    const data = await reportModel.getRainoutsPerMonth();
    res.writeHead(200, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching rainout data:", error);
    res.writeHead(500, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({ message: 'Server error: ' + error.message }));
  }
};

exports.getRainoutRows = async (req, res) => {
  try {
    const data = await reportModel.getRainoutRows();
    res.writeHead(200, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(data));
  } catch (error) {
    res.writeHead(500, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({ message: 'Server error: ' + error.message }));
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const data = await reportModel.getRevenueSummary();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  } catch (error) {
    res.writeHead(500, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({ message: 'Server error: ' + error.message }));
  }
};

exports.getRevenueDetails = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        pp.product_type,
        pp.product_id,
        CASE 
          WHEN pp.product_type = 'Ticket' THEN tt.ticket_type
          ELSE NULL
        END AS ticket_type,
        pp.quantity_sold,
        pp.purchase_price,
        pp.total_amount,
        pp.purchase_created,
        v.First_name,
        v.Last_name
      FROM product_purchases pp
      JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
      JOIN visitors v ON t.Visitor_ID = v.Visitor_ID
      LEFT JOIN ticket_type tt ON pp.product_type = 'Ticket' AND pp.product_id = tt.ticket_id
      ORDER BY pp.purchase_created DESC;
    `);
    const results = await reportModel.getRevenueDetails();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Failed to retrieve revenue details." }));
  }
};


exports.getRevenueSummary = async (req, res) => {
  try {
    const summary = await reportModel.getRevenueSummary();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(summary));
  } catch (error) {
    console.error("Error generating revenue summary:", error);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: "Failed to retrieve revenue summary." }));
  }
};
exports.getOpenMaintenanceCount = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT COUNT(*) AS count FROM maintenance WHERE Maint_Status = 'In Progress'"
    );
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ count: result[0].count }));
  } catch (error) {
    console.error("Error fetching open maintenance count:", error);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: 'Failed to fetch open maintenance count' }));
  }
};
exports.getTicketsSoldToday = async (req, res) => {
  try {
    const total = await reportModel.getTicketsSoldToday();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ total }));
  } catch (err) {
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: 'Failed to fetch tickets sold today.' }));
  }
};

exports.getTotalVisitorsToday = async (req, res) => {
    try {
        const visitors = await reportModel.getTotalVisitorsToday();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(visitors));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Failed to get total visitors for today'}));
    }
};

exports.getTicketSalesReport = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
            tt.ticket_type AS ticket_type,
            SUM(pp.quantity_sold) AS total_sold,
            ROUND(AVG(pp.quantity_sold), 2) AS monthly_avg
            FROM product_purchases pp
            JOIN ticket_type tt ON pp.product_id = tt.ticket_id
            WHERE pp.product_type = 'Ticket'
            GROUP BY tt.ticket_type;
        `);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(results));
    } catch (err) {
        console.error('Ticket sales report error:', err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};

exports.getTicketSalesTrends = async (req, res) => {
  try {
      const [daily] = await db.query(`
          SELECT 
          DATE(purchase_created) AS label,
          tt.ticket_type,
          SUM(quantity_sold) AS total
          FROM product_purchases pp
          JOIN ticket_type tt ON pp.product_id = tt.ticket_id
          WHERE pp.product_type = 'Ticket'
          GROUP BY label, tt.ticket_type
          ORDER BY label;
      `);
      const [weekly] = await db.query(`
          SELECT 
          YEARWEEK(purchase_created, 1) AS label,
          tt.ticket_type,
          SUM(quantity_sold) AS total
          FROM product_purchases pp
          JOIN ticket_type tt ON pp.product_id = tt.ticket_id
          WHERE pp.product_type = 'Ticket'
          GROUP BY label, tt.ticket_type
          ORDER BY label;
      `);
      const [monthly] = await db.query(`
          SELECT 
          DATE_FORMAT(purchase_created, '%Y-%m') AS label,
          tt.ticket_type,
          SUM(quantity_sold) AS total
          FROM product_purchases pp
          JOIN ticket_type tt ON pp.product_id = tt.ticket_id
          WHERE pp.product_type = 'Ticket'
          GROUP BY label, tt.ticket_type
          ORDER BY label;
      `);
      const [yearly] = await db.query(`
          SELECT 
          YEAR(purchase_created) AS label,
          tt.ticket_type,
          SUM(quantity_sold) AS total
          FROM product_purchases pp
          JOIN ticket_type tt ON pp.product_id = tt.ticket_id
          WHERE pp.product_type = 'Ticket'
          GROUP BY label, tt.ticket_type
          ORDER BY label;
      `);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ daily, weekly, monthly, yearly }));
  } catch (err) {
      console.error('Error fetching ticket sales trends:', err);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

exports.getTicketPurchaseDetails = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        pp.product_type,
        pp.product_id,
        pp.quantity_sold,
        pp.purchase_price,
        pp.total_amount,
        pp.purchase_created,
        v.First_name,
        v.Last_name,
        tt.ticket_type
      FROM product_purchases pp
      JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
      JOIN visitors v ON t.Visitor_ID = v.Visitor_ID
      JOIN ticket_type tt ON pp.product_id = tt.ticket_id
      WHERE pp.product_type = 'Ticket'
      ORDER BY pp.purchase_created DESC
    `);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
  } catch (error) {
    console.error("Error fetching ticket purchase details:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Failed to retrieve ticket purchase details." }));
  }
};


exports.getCustomerStats = async (req, res) => {
    try {
        const [monthly] = await db.query(`
            SELECT 
            DATE_FORMAT(purchase_created, '%Y-%m') AS month,
            SUM(quantity_sold) AS customers
            FROM product_purchases
            WHERE product_type = 'Ticket'
            GROUP BY month
            ORDER BY month ASC
        `);
        const [averageResult] = await db.query(`
            SELECT ROUND(AVG(monthly_total), 2) AS average
            FROM (
            SELECT 
            SUM(quantity_sold) AS monthly_total
            FROM product_purchases
            WHERE product_type = 'Ticket'
            GROUP BY DATE_FORMAT(purchase_created, '%Y-%m')
            ) AS monthly_data
        `);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
        monthly,
        average: averageResult[0].average
        }));
    } catch (error) {
        console.error('Customer stats report error:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Failed to fetch customer stats.' }));
    }
};

exports.getCustomerCounts = async (req, res) => {
    try {
        const [daily] = await db.query(`
            SELECT 
            DATE(t.Transaction_date) AS date,
            SUM(pp.quantity_sold) AS customers
            FROM product_purchases pp
            JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
            WHERE pp.product_type = 'Ticket'
            GROUP BY date
            ORDER BY date;
        `);
        const [weekly] = await db.query(`
            SELECT 
            YEARWEEK(t.Transaction_date, 1) AS week,
            SUM(pp.quantity_sold) AS customers
            FROM product_purchases pp
            JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
            WHERE pp.product_type = 'Ticket'
            GROUP BY week
            ORDER BY week;
        `);
        const [monthly] = await db.query(`
            SELECT 
            DATE_FORMAT(t.Transaction_date, '%Y-%m') AS month,
            SUM(pp.quantity_sold) AS customers
            FROM product_purchases pp
            JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
            WHERE pp.product_type = 'Ticket'
            GROUP BY month
            ORDER BY month;
        `);
        const [yearly] = await db.query(`
            SELECT 
            YEAR(t.Transaction_date) AS year,
            SUM(pp.quantity_sold) AS customers
            FROM product_purchases pp
            JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
            WHERE pp.product_type = 'Ticket'
            GROUP BY year
            ORDER BY year;
        `);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ daily, weekly, monthly, yearly }));
    } catch (error) {
        console.error('Error fetching customer counts:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Failed to fetch customer stats.' }));
    }
};