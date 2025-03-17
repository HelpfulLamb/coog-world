const { Booth } = require('../models/boothModel.js');

const getBooths = async (req, res) => {
    try {
        const booths = await Booth.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(booths));
    } catch (error) {
        console.error('Error fetching booths: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getBooths
}