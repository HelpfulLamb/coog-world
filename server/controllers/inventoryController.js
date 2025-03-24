const { Inventory } = require('../models/inventoryModel.js');

const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(inventory));
    } catch (error) {
        console.error('Error fetching inventory: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getInventory
}