const express = require('express');
const cors = require('cors');


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


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());


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


app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));