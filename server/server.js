const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const rideRouter = require('./routes/rideRoutes.js');
const ticketRouter = require('./routes/ticketRoutes');
const visitorRouter = require('./routes/visitorRoutes.js');
const employeeRouter = require('./routes/employeeRoutes.js');
const showRouter = require('./routes/showRoutes.js');
const inventoryRouter = require('./routes/inventoryRoutes.js');
const maintenanceRouter = require('./routes/maintenanceRoutes.js');
const weatherRouter = require('./routes/weatherRoutes.js');
const kioskRouter = require('./routes/kioskRouter.js');
const shopRoutes = require('./routes/shopRoutes');
const reportRoutes = require('./routes/reportRoutes.js');
const attendanceRouter = require('./routes/attendanceRoutes.js');
const cartRouter = require('./routes/cartRoutes.js');
const stageRouter = require('./routes/stageRoutes.js');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === 'OPTIONS') return res.end();

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    if(req.method === 'GET' && (pathname === '/' || pathname.startsWith('/static'))){
        const filePath = path.join(__dirname, 'client', pathname === '/' ? 'index.html' : pathname);
        fs.readFile(filePath, (err, data) => {
            if(err){
                res.writeHead(404);
                return res.end('Not Found');
            }
            res.writeHead(200);
            res.end(data);
        });
        return;
    }
    const routeMap = {
        '/api/rides' : rideRouter,
        '/api/ticket-type' : ticketRouter,
        '/api/users' : visitorRouter,
        '/api/employees' : employeeRouter,
        '/api/shows' : showRouter,
        '/api/inventory' : inventoryRouter,
        '/api/maintenance' : maintenanceRouter,
        '/api/weather' : weatherRouter,
        '/api/kiosks' : kioskRouter,
        '/api/shop-purchases' : shopRoutes,
        '/api/reports' : reportRoutes,
        '/api/attendance' : attendanceRouter,
        '/api/cart' : cartRouter,
        '/api/stages' : stageRouter
    };
    const matchedRoute = Object.keys(routeMap).find(route => pathname.startsWith(route));
    if(matchedRoute){
        return routeMap[matchedRoute](req, res);
    }
    if(req.method === 'GET'){
        const fallbackPath = path.join(__dirname, 'client', 'index.html');
        fs.readFile(fallbackPath, (err, data) => {
            if(err){
                res.writeHead(404);
                return res.end('Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
server.listen(PORT, () => {console.log(`Server running at http://localhost:${PORT}`);});