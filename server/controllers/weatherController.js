const weatherModel = require('../models/weatherModel.js');

exports.createWeather = async (req, res) => {
    console.log('Received data:', req.body);
    try {
        const {Wtr_cond, Wtr_level, Special_alerts, Is_park_closed} = req.body;
        const Wtr_ID = await weatherModel.createWeather({ Wtr_cond, Wtr_level, Special_alerts, Is_park_closed });
        res.status(201).json({id: Wtr_ID, Wtr_cond, Wtr_level, Special_alerts, Is_park_closed});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllWeather = async (req, res) => {
    try {
        const weather = await weatherModel.getAllWeather();
        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getWeatherInfo = async (req, res) => {
    try {
        const info = await weatherModel.getWeatherInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getWeatherById = async (req, res) => {
    try {
        const weather = await weatherModel.getWeatherById(req.params.id);
        if(!weather){
            return res.status(404).json({message: 'Weather not found'});
        }
        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllWeather = async (req, res) => {
    try {
        await weatherModel.deleteAllWeather();
        res.status(200).json({message: 'All weathers deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteWeatherById = async (req, res) => {
    try {
        await weatherModel.deleteWeatherById(req.params.id);
        res.status(200).json({message: 'Weather deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};