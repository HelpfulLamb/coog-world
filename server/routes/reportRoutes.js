const express = require('express');
const reportRoutes = express.Router();
const reportController = require('../controllers/reportController.js');

reportRoutes.get('/rainouts', reportController.getRainoutsReport);
reportRoutes.get('/rainout-rows', reportController.getRainoutRows);
reportRoutes.get('/revenue', reportController.getRevenueReport);
reportRoutes.get('/revenue-summary', reportController.getRevenueSummary);
reportRoutes.get('/tickets-today', reportController.getTicketsSoldToday);
reportRoutes.get('/revenue-details', reportController.getRevenueDetails);
reportRoutes.get('/ticket-sales', reportController.getTicketSalesReport);
reportRoutes.get('/customer-counts', reportController.getCustomerCounts);
reportRoutes.get('/customer-stats', reportController.getCustomerStats);
reportRoutes.get('/ticket-sales-trends', reportController.getTicketSalesTrends);
module.exports = {
  reportRoutes
};