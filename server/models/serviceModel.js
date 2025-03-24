const { db } = require('../config/db.js');

const Service = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM services';
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
    Service
};