const { db } = require('../config/db.js');

const Employee = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM employees';
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
    Employee
};