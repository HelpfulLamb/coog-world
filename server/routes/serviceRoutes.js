const { getServices } = require('../controllers/serviceController.js');
const express = require('express');
const serviceRouter = express.Router();

serviceRouter.get('/', getServices);

module.exports = {
    serviceRouter
}