const maintenanceController = require('../controllers/maintenanceController.js');
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

module.exports = async function maintenanceRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-maintenance')){
                const body = await parseBody(req);
                return maintenanceController.createMaintenance(req, res, body);
            }
        }
        if(req.method === 'PUT'){
            if(/\/status\/\d+$/.test(pathname)){
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return maintenanceController.updateStatus(req, res, id, body);
            }
        }
        if(req.method === 'GET'){
            if(pathname === '/api/maintenance'){
                return maintenanceController.getAllMaintenance(req, res);
            } else if(pathname.endsWith('/info')){
                return maintenanceController.getMaintenanceInfo(req, res);
            } else if(pathname.endsWith('/object')){
                return maintenanceController.getMaintenanceById(req, res);
            } else if(pathname.endsWith('/ride-breakdowns')){
                return maintenanceController.getRideBreakdowns(req, res);
            } else if(pathname.endsWith('/stage-breakdowns')){
                return maintenanceController.getStageBreakdowns(req, res);
            } else if(pathname.endsWith('/kiosk-breakdowns')){
                return maintenanceController.getKioskBreakdowns(req, res);
            } else if(pathname.endsWith('/pending')){
                return maintenanceController.getOpenMaintenanceCount(req, res);
            } else if(pathname.endsWith('/avg-stat')){
                return maintenanceController.getParkMaintenance(req, res);
            } else if(/\/objects\/\w+$/.test(pathname)){
                const type = pathname.split('/').pop();
                return maintenanceController.getObjectsByType(req, res, type);
                
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return maintenanceController.deleteAllMaintenance(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return maintenanceController.deleteMaintenanceById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Maintenance Route Not Found');
    } catch (error) {
        console.error('Error in maintenanceRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};