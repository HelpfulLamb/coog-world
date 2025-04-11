const express = require('express');
const reportRoutes = express.Router();
const reportController = require('../controllers/reportController.js');

reportRoutes.get('/rainouts', reportController.getRainoutsReport);
reportRoutes.get('/revenue', reportController.getRevenueReport);
//reportRoutes.get('/revenue-summary', reportController.getRevenueSummary);
reportRoutes.get('/revenue-summary', reportController.getRevenueSummary);
reportRoutes.get('/revenue-details', reportController.getRevenueDetails);
module.exports = {
  reportRoutes
};
