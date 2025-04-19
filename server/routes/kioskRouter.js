const kioskController = require('../controllers/kioskController.js');
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

module.exports = async function kioskRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-kiosk')){
                const body = await parseBody(req);
                return kioskController.createKiosk(req, res, body);
            }
        }
        if(req.method === 'PUT' && /^\/api\/kiosks\/\d+$/.test(pathname)){
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return kioskController.updateKiosk(req, res, id, body);
        }
        if(req.method === 'GET'){
            if(pathname === '/api/kiosks'){
                return kioskController.getAllKiosks(req, res);
            } else if(pathname.endsWith('/info')){
                return kioskController.getKioskInfo(req, res);
            } else if(pathname.endsWith('/shops')){
                return kioskController.getAllMerchShops(req, res);
            } else if(pathname.endsWith('/booths')){
                return kioskController.getAllBooths(req, res);
            } else if(pathname.endsWith('/food')){
                return kioskController.getAllFoodShops(req, res);
            } else if(/\/api\/kiosks\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return kioskController.getKioskById(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return kioskController.deleteAllKiosks(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return kioskController.deleteKioskById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Kiosk Route Not Found');
    } catch (error) {
        console.error('Error in kioskRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};