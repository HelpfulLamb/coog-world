const { getVisitors } = require('../controllers/visitorController.js');
const express = require('express');
const visitorRouter = express.Router();

visitorRouter.get('/', getVisitors);

module.exports = {
    visitorRouter
}