const inventoryController = require('../controllers/inventoryController.js');
const url = require('url');

module.exports = async function shopRoutes(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'GET'){
            if(/\/api\/shop-purchases\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return inventoryController.getVisitorPurchases(req, res, id);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Shop Route Not Found');
    } catch (error) {
        console.error('Error in shopRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};