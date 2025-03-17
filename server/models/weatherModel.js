const { db } = require('../config/db.js');

const Weather = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM weather';
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
    Weather
};