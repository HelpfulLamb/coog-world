const { db } = require('../config/db.js');

const Inventory = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM inventory';
            db.query(query, (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
};

module.exports = {
    Inventory
};