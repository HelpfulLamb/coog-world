const { getBooths } = require('../controllers/boothController.js');
const express = require('express');
const boothRouter = express.Router();

boothRouter.get('/', getBooths);

module.exports = {
    boothRouter
}