const { Shop } = require('../models/shopModel.js');

const getShops = async (req, res) => {
    try {
        const shops = await Shop.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(shops));
    } catch (error) {
        console.error('Error fetching shops: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getShops
}