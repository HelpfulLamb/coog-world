const { db } = require('../config/db.js');

const Maintenance = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM maintenance';
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
    Maintenance
};