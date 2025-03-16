const { getRides } = require('../controllers/rideController.js');

const rideRoutes = (req, res) => {
    if(req.url === '/rides' && req.method === 'GET'){
        getRides(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
}

module.exports = {
    rideRoutes
}