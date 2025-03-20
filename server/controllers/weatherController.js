const weatherModel = require('../models/weatherModel.js');

exports.createWeather = async (req, res) => {
    try {
        const {date_recorded, condition, rainout_num, rainout_date, precipitation, temperature, air_quality, uv_index, alerts} = req.body;
        const weatherId = await weatherModel.createWeather(date_recorded, condition, rainout_num, rainout_date, precipitation, temperature, air_quality, uv_index, alerts);
        res.status(201).json({id: weatherId, date_recorded, condition, rainout_num, rainout_date, precipitation, temperature, air_quality, uv_index, alerts});
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