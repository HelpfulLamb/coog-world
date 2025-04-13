const weatherController = require('../controllers/weatherController.js');
const express = require('express');
const weatherRouter = express.Router();

// create new weather
weatherRouter.post('/create-weather', weatherController.createWeather);

// updating existing logs
weatherRouter.put('/:id', weatherController.updateWeather);

// mark triggers as seen
weatherRouter.patch('/weather-alerts/:id/acknowledge', weatherController.markMessageSeen);

// retrieve weather (all or specific)
weatherRouter.get('/', weatherController.getAllWeather);
weatherRouter.get('/weather-alerts', weatherController.getWeatherAlerts);
weatherRouter.get('/info', weatherController.getWeatherInfo);
weatherRouter.get('/:id', weatherController.getWeatherById);

// delete weather (all or specific)
weatherRouter.delete('/delete-all', weatherController.deleteAllWeather);
weatherRouter.delete('/delete-selected', weatherController.deleteWeatherById);


module.exports = {
    weatherRouter
}