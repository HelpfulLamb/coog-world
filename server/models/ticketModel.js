const { db } = require('../config/db.js');

const TicketType = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ticket_type';
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
    TicketType
};