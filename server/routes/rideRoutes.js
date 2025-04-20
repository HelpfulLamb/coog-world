const rideController = require('../controllers/rideController.js');
const url = require('url');

function parseBody(req){
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = async function rideRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-ride')){
                const body = await parseBody(req);
                return rideController.createRide(req, res, body);
            } else if(pathname.endsWith('/log')){
                const body = await parseBody(req);
                return rideController.logVisitorRide(req, res, body);
            }
        }
        if(req.method === 'PUT' && /^\/api\/rides\/\d+$/.test(pathname)){
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return rideController.updateRide(req, res, id, body);
        }
        if(req.method === 'GET'){
            if(pathname === '/api/rides'){
                return rideController.getAllRides(req, res);
            } else if(pathname.endsWith('/info')){
                return rideController.getRideInfo(req, res);
            } else if(pathname.endsWith('/user-view')){
                return rideController.getRideForCard(req, res);
            } else if(pathname.endsWith('/ride-stats')){
                return rideController.getRideStatsByMonth(req, res);
            } else if(pathname.endsWith('/ride-details')){
                return rideController.getDetailedRideLog(req, res);
            } else if(/\/history\/\d+$/.test([pathname])){
                const id = pathname.split('/').pop();
                return rideController.getVisitorRideHistory(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return rideController.deleteAllRides(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return rideController.deleteRideById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Ride Route Not Found');
    } catch (error) {
        console.error('Error in rideRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};