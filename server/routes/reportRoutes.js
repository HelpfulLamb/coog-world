const express = require('express');
const reportRoutes = express.Router();
const reportController = require('../controllers/reportController.js');

reportRoutes.get('/rainouts', reportController.getRainoutsReport);
reportRoutes.get('/rainout-rows', reportController.getRainoutRows);
reportRoutes.get('/revenue', reportController.getRevenueReport);
//reportRoutes.get('/revenue-summary', reportController.getRevenueSummary);
reportRoutes.get('/revenue-summary', reportController.getRevenueSummary);
module.exports = {
  reportRoutes
};
