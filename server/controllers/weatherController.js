const { Weather } = require('../models/weatherModel.js');

const getWeather = async (req, res) => {
    try {
        const weather = await Weather.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(weather));
    } catch (error) {
        console.error('Error fetching weather: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getWeather
}