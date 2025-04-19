const inventoryController = require('../controllers/inventoryController.js');
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

module.exports = async function inventoryRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-assignment')){
                const body = await parseBody(req);
                return inventoryController.createAssignment(req, res, body);
            } else if(pathname.endsWith('/create-item')){
                const body = await parseBody(req);
                return inventoryController.createItem(req, res, body);
            } else if(pathname.endsWith('/purchase')){
                const body = await parseBody(req);
                return inventoryController.purchaseMerch(req, res, body);
            }
        }
        if(req.method === 'PUT'){
            if(/\/items\/\d+$/.test(pathname)){
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return inventoryController.updateItem(req, res, id, body);
            } else if(/\/restock\/\d+$/.test(pathname)){
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return inventoryController.restockItem(req, res, id, body);
            }
        }
        if(req.method === 'PATCH' && /^\/api\/inventory\/restock-alerts\/\d+\/acknowledge$/.test(pathname)){
            const id = pathname.split('/')[4];
            return inventoryController.markMessageSeen(req, res, id);
        }
        if(req.method === 'GET'){
            if(pathname.endsWith('/all')){
                return inventoryController.getAllInventory(req, res);
            } else if(pathname.endsWith('/info')){
                return inventoryController.getInventoryInfo(req, res);
            } else if(pathname.endsWith('/merchandise')){
                return inventoryController.getAllAvailableItems(req, res);
            } else if(pathname.endsWith('/items')){
                return inventoryController.getAllItems(req, res);
            } else if(pathname.endsWith('/restock-alerts')){
                return inventoryController.getInvStockAlerts(req, res);
            } else if(/\/shop-purchases\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return inventoryController.getVisitorPurchases(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return inventoryController.deleteAllInventory(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return inventoryController.deleteAssignmentById(req, res, body);
            } else if(pathname.endsWith('/delete-selected-item')){
                const body = await parseBody(req);
                return inventoryController.deleteItemById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Inventory Route Not Found');
    } catch (error) {
        console.error('Error in inventoryRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};