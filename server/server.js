const express = require('express');
const cors = require('cors');
// const http = require('http');

const { rideRouter } = require('./routes/rideRoutes.js');
const { ticketRouter } = require('./routes/ticketRoutes.js');

/*
const { boothRouter } = require('./routes/boothRoutes.js');
const { employeeRouter } = require('./routes/employeeRoutes.js');
const { inventoryRouter } = require('./routes/inventoryRoutes.js');
const { maintenanceRouter } = require('./routes/maintenanceRoutes.js');
const { serviceRouter } = require('./routes/serviceRoutes.js');
const { shopRouter } = require('./routes/shopRoutes.js');
const { showRouter } = require('./routes/showRoutes.js');
const { visitorRouter } = require('./routes/visitorRoutes.js');
const { weatherRouter } = require('./routes/weatherRoutes.js');
*/

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use('/rides', rideRouter);
app.use('/ticket-type', ticketRouter);

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// const server = http.createServer((req, res) => {
//     if(req.url.startsWith('/rides')) {
//         rideRoutes(req, res);
//     } else if(req.url.startsWith('/ticket-type')) {
//         ticketRoutes(req, res);
//     } else {
//         res.writeHead(404, {'Content-Type': 'text/plain'});
//         res.end('Not Found');
//     }
// });

// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));