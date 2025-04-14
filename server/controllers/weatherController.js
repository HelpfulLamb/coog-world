const weatherModel = require('../models/weatherModel.js');

exports.createWeather = async (req, res) => {
    const {temperature, Wtr_cond, Wtr_level, Special_alerts} = req.body;
    if(!temperature || !Wtr_cond || !Wtr_level || !Special_alerts){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        await weatherModel.createWeather({temperature, Wtr_cond, Wtr_level, Special_alerts});
        res.status(201).json({message: 'New weather logged successfully.'});        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateWeather = async (req, res) => {
    try {
        const wtrID = req.params.id;
        const updatedData = req.body;
        const selectedWeather = {...updatedData, Wtr_ID: wtrID};
        const updatedWeather = await weatherModel.updateWeather(selectedWeather);
        if(!updatedWeather){
            return res.status(404).json({message: 'Weather log not found or not updated.'});
        }
        res.status(200).json({message: 'Weather log updated successfully.', weather: updatedData});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.markMessageSeen = async (req, res) => {
    const alertID = req.params.id;
    try {
        await weatherModel.markMessageSeen(alertID);
        res.status(200).json({message: 'Weather alert acknowledged.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getWeatherAlerts = async (req, res) => {
    try {
        const message = await weatherModel.getWeatherAlerts();
        res.status(200).json(message || []);
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
        if(!info){
            return res.status(404).json({message: 'Weather information not found.'});
        }
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
        const {Wtr_ID} = req.body;
        if(!Wtr_ID){
            return res.status(400).json({message: 'Invalid weather ID provided. Check server status.'});
        }
        await weatherModel.deleteWeatherById(Wtr_ID);
        res.status(200).json({message: 'Weather log deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};