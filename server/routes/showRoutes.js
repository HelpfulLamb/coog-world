const { getShows } = require('../controllers/showController.js');
const express = require('express');
const showRouter = express.Router();

showRouter.get('/', getShows);

module.exports = {
    showRouter
}