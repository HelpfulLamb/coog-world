const express = require('express');
const reportRoutes = express.Router();
const reportController = require('../controllers/reportController.js');

reportRoutes.get('/rainouts', reportController.getRainoutsReport);

module.exports = {
    reportRoutes
}