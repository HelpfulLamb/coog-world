const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routers
const { rideRouter } = require('./routes/rideRoutes.js');
const { ticketRouter } = require('./routes/ticketRoutes.js');
const { visitorRouter } = require('./routes/visitorRoutes.js');
const { employeeRouter } = require('./routes/employeeRoutes.js');
const { serviceRouter } = require('./routes/serviceRoutes.js');
const { showRouter } = require('./routes/showRoutes.js');
const { inventoryRouter } = require('./routes/inventoryRoutes.js');
const { maintenanceRouter } = require('./routes/maintenanceRoutes.js');
const { weatherRouter } = require('./routes/weatherRoutes.js');
const { kioskRouter } = require('./routes/kioskRouter.js');
const shopRoutes = require('./routes/shopRoutes');
const { reportRoutes } = require('./routes/reportRoutes.js');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Use routers
app.use('/api/rides', rideRouter);
app.use('/api/ticket-type', ticketRouter);
app.use('/api/users', visitorRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/services', serviceRouter);
app.use('/api/shows', showRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/kiosks', kioskRouter);
app.use('/api/shop-purchases', shopRoutes);
app.use('/api/reports', reportRoutes); 

// Serve frontend files
app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
