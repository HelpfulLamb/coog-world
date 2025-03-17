const app = require('express');
const http = require('http');
const { rideRoutes } = require('./routes/rideRoutes.js');
const { ticketRoutes } = require('./routes/ticketRoutes.js');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if(req.url.startsWith('/rides')) {
        rideRoutes(req, res);
    } else if(req.url.startsWith('/ticket-type')) {
        ticketRoutes(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));