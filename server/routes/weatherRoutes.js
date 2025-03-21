const weatherController = require('../controllers/weatherController.js');
const express = require('express');
const weatherRouter = express.Router();

// create new rides
weatherRouter.post('/', weatherController.createWeather);

// retrieve rides (all or specific)
weatherRouter.get('/', weatherController.getAllWeather);
weatherRouter.get('/:id', weatherController.getWeatherById);

// delete rides (all or specific)
weatherRouter.delete('/', weatherController.deleteAllWeather);
weatherRouter.delete('/:id', weatherController.deleteWeatherById);


module.exports = {
    weatherRouter
}