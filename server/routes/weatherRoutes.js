const { getWeather } = require('../controllers/weatherController.js');
const express = require('express');
const weatherRouter = express.Router();

weatherRouter.get('/', getWeather);

module.exports = {
    weatherRouter
}