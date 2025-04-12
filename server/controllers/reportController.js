const reportModel = require('../models/reportModel.js');
const { Parser } = require('json2csv'); 

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