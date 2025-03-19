const express = require('express');
const cors = require('cors');

const { rideRouter } = require('./routes/rideRoutes.js');
const { ticketRouter } = require('./routes/ticketRoutes.js');
const { visitorRouter } = require('./routes/visitorRoutes.js');

/*const { boothRouter } = require('./routes/boothRoutes.js');
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
app.use(express.json());
app.use(cors());

//app.use('/api/rides', rideRouter);
//app.use('/api/ticket-type', ticketRouter);
app.use('/api/users', visitorRouter);

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));