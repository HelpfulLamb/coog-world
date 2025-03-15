const mysql = require('mysql');
const dotenv = require('dotenv');
const fs = require('fs')
dotenv.config({ path: './.env' });

const db = mysql.createPool({
    connectionLimit: process.env.DB_connectionLimit,
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    /*ssl:{
       ca: fs.readFileSync(process.env.SSL_CERT)
    } */
});

const query = 'SELECT * FROM rides';
db.query(query, (err, result) => {
    if(err){
        console.error('Error: ', err);
    } else {
        console.log('Success', result);
    }
});

module.exports = {
    db
};