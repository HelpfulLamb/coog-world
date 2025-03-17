const { getRides } = require('../controllers/rideController.js');
const express = require('express');
const rideRouter = express.Router();

rideRouter.get('/', getRides);

// const rideRoutes = (req, res) => {
//     if(req.url === '/rides' && req.method === 'GET'){
//         getRides(req, res);
//     } else {
//         res.writeHead(404, {'Content-Type': 'text/plain'});
//         res.end('Not Found');
//     }
// }

module.exports = {
    rideRouter
    // rideRoutes
}