const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Routers
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

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.jsx': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const staticPath = path.join(__dirname, 'client'); // client contains your built frontend

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.end();

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // ✅ API routing
    const routeMap = {
        '/api/rides': rideRouter,
        '/api/ticket-type': ticketRouter,
        '/api/users': visitorRouter,
        '/api/employees': employeeRouter,
        '/api/shows': showRouter,
        '/api/inventory': inventoryRouter,
        '/api/maintenance': maintenanceRouter,
        '/api/weather': weatherRouter,
        '/api/kiosks': kioskRouter,
        '/api/shop-purchases': shopRoutes,
        '/api/reports': reportRoutes,
        '/api/attendance': attendanceRouter,
        '/api/cart': cartRouter,
        '/api/stages': stageRouter
    };

    const matchedRoute = Object.keys(routeMap).find(route => pathname.startsWith(route));
    if (matchedRoute) {
        return routeMap[matchedRoute](req, res);
    }

    // ✅ Static file and frontend handling
    if (req.method === 'GET') {
        let filePath;

        if (pathname === '/') {
            filePath = path.join(staticPath, 'index.html');
        } else if (pathname.startsWith('/assets/') || pathname === '/favicon.ico') {
            filePath = path.join(staticPath, pathname);
        } else {
            // React Router fallback
            filePath = path.join(staticPath, 'index.html');
        }

        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (pathname.startsWith('/assets/')) {
                    res.writeHead(404);
                    return res.end('Not Found');
                }
                // fallback for unknown route
                fs.readFile(path.join(staticPath, 'index.html'), (fallbackErr, fallbackData) => {
                    if (fallbackErr) {
                        res.writeHead(404);
                        return res.end('Not Found');
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    return res.end(fallbackData);
                });
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                return res.end(data);
            }
        });

        return;
    }

    // Default 404
    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
