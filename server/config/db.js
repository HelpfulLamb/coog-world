const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs')
dotenv.config({ path: './coog-world/server/config/.env' });

// create connection to database
const db = mysql.createPool({
    connectionLimit: process.env.DB_connectionLimit,
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    ssl:{
       ca: fs.readFileSync(process.env.SSL_CERT)
    }
});

// test database connection
db.getConnection((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('MySQL Connected...');
    }
});

module.exports = db.promise();