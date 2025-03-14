const http = require('http');
const { db } = require('./config/db');
const PORT = process.env.PORT || 3000;

db.getConnection((err) => {
    if(err){
        console.log(err);
    } else{
        console.log('MySQL Connected...');
    }
});

const server = http.createServer(async (req, res) => {
    if(req.url === '/coogworld' && req.method === 'GET'){
        db.query('SELECT 1 + 1 AS solution', (error, results) =>{
            if(error){
                console.error('Database connection error: ', error);
                res.writeHead(500, {'Content-type':'text/plain'});
                return res.end('Database connection failed.')
            }
            res.writeHead(200, {'Content-type':'text/plain'});
            res.end(`Database connection successful. Result: ${results[0].solution}`);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Not Found");
    }
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));