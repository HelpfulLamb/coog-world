const { db } = require('../config/db.js');

const Show = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM shows';
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
    Show
};