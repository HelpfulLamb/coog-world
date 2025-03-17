const { Visitor } = require('../models/weatherModel.js');

const getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(visitors));
    } catch (error) {
        console.error('Error fetching visitors: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getVisitors
}