const { db } = require('../config/db.js');

const Shop = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM shops';
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
    Shop
};