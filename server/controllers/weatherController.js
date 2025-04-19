const weatherModel = require('../models/weatherModel.js');
const db = require('../config/db.js');

exports.createWeather = async (req, res, body) => {
    const {temperature, Wtr_cond, Wtr_level, Special_alerts} = body;
    if(!temperature || !Wtr_cond || !Wtr_level || !Special_alerts){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'All fields are required! Somethings missing.'}));
    }
    try {
        await weatherModel.createWeather({temperature, Wtr_cond, Wtr_level, Special_alerts});
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'New weather logged successfully.'}));        
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.updateWeather = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedWeather = {...updatedData, Wtr_ID: id};
        const updatedWeather = await weatherModel.updateWeather(selectedWeather);
        if(!updatedWeather){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Weather log not found or not updated.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Weather log updated successfully.', weather: updatedData}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.markMessageSeen = async (req, res, id) => {
    try {
        await weatherModel.markMessageSeen(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Weather alert acknowledged.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getWeatherAlerts = async (req, res) => {
    try {
        const message = await weatherModel.getWeatherAlerts();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(message || []));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllWeather = async (req, res) => {
    try {
        const weather = await weatherModel.getAllWeather();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(weather));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getWeatherInfo = async (req, res) => {
    try {
        const info = await weatherModel.getWeatherInfo();
        if(!info){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Weather information not found.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getWeatherById = async (req, res, id) => {
    try {
        const weather = await weatherModel.getWeatherById(id);
        if(!weather){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Weather not found'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(weather));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteAllWeather = async (req, res) => {
    try {
        await weatherModel.deleteAllWeather();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All weathers deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteWeatherById = async (req, res, body) => {
    try {
        const {Wtr_ID} = body;
        if(!Wtr_ID){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Invalid weather ID provided. Check server status.'}));
        }
        await weatherModel.deleteWeatherById(Wtr_ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Weather log deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getLatestWeather = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT Wtr_cond, temperature
        FROM weather
        ORDER BY Wtr_ID DESC
        LIMIT 1
      `);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(rows[0]));
    } catch (err) {
      console.error('Error fetching latest weather:', err);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Database error'}));
    }
  };