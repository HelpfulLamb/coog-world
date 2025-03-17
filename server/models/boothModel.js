const { db } = require('../config/db.js');

const Booth = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM booths';
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
    Booth
};