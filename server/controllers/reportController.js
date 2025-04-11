const reportModel = require('../models/reportModel.js');
const { Parser } = require('json2csv'); 
const db = require('../config/db.js');

exports.getRainoutsReport = async (req, res) => {
  try {
    const data = await reportModel.getRainoutsPerMonth();
    if (req.query.format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment('rainouts_report.csv');
      return res.status(200).send(csv); 
    }

    return res.status(400).json({ message: 'Invalid format specified. Use "csv".' });
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