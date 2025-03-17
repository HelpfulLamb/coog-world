const { getMaintenance } = require('../controllers/maintenanceController.js');
const express = require('express');
const maintenanceRouter = express.Router();

maintenanceRouter.get('/', getMaintenance);

module.exports = {
    maintenanceRouter
}