const { Show } = require('../models/showModel.js');

const getShows = async (req, res) => {
    try {
        const shows = await Show.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(shows));
    } catch (error) {
        console.error('Error fetching shows: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getShows
}