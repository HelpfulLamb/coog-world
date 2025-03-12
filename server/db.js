const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const db = mysql.createPool({
    connectionLimit: process.env.DB_connectionLimit,
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database
});

module.exports = {
    db
};