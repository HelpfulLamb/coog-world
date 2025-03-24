const { db } = require('../config/db.js');

const Ride = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM rides';
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
    Ride
};