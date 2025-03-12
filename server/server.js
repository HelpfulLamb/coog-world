const http = require('http');
const { db } = require('./db');
const PORT = process.env.PORT || 5000;

db.getConnection((err) => {
    if(err){
        console.log(err);
    } else{
        console.log('MySQL Connected...');
    }
});

const server = http.createServer(async (req, res) => {
    if(req.url === '/' && req.method === 'GET'){
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end("<h1>Worked?</h1>");
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<h1>ERROR, File Not Found</h1>");
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
