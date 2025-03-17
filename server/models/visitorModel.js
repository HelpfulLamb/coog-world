const { db } = require('../config/db.js');

const Visitor = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM visitors';
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
    Visitor
};