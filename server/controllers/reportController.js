const reportModel = require('../models/reportModel.js');
const { Parser } = require('json2csv'); 
const db = require('../config/db.js');

exports.getRainoutsReport = async (req, res) => {
  try {
    const data = await reportModel.getRainoutsPerMonth();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching rainout data:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getRainoutRows = async (req, res) => {
  try {
    const data = await reportModel.getRainoutRows();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const data = await reportModel.getRevenueSummary();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getRevenueDetails = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        product_type, 
        quantity_sold, 
        purchase_price, 
        total_amount, 
        purchase_created 
      FROM product_purchases
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    res.status(500).json({ message: "Failed to retrieve revenue details." });
  }
};

exports.getRevenueSummary = async (req, res) => {
  try {
    const summary = await reportModel.getRevenueSummary();
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error generating revenue summary:", error);
    res.status(500).json({ message: "Failed to retrieve revenue summary." });
  }
};

exports.getTicketsSoldToday = async (req, res) => {
  try {
    const total = await reportModel.getTicketsSoldToday();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets sold today.' });
  }
};

exports.getTotalVisitorsToday = async (req, res) => {
    try {
        const visitors = await reportModel.getTotalVisitorsToday();
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({message: 'Failed to get total visitors for today'});
    }
  
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
    res.json(results);
  } catch (err) {
    console.error('Ticket sales report error:', err);
    res.status(500).json({ message: 'Internal server error' });
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

    res.status(200).json({
      monthly,
      average: averageResult[0].average
    });
  } catch (error) {
    console.error('Customer stats report error:', error);
    res.status(500).json({ message: 'Failed to fetch customer stats.' });
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

    res.status(200).json({ daily, weekly, monthly, yearly });
  } catch (error) {
    console.error('Error fetching customer counts:', error);
    res.status(500).json({ message: 'Failed to fetch customer stats.' });
  }
};