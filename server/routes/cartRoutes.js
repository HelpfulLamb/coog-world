const cartController = require('../controllers/cartController.js');
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

module.exports = async function cartRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/add-item')){
                const body = await parseBody(req);
                return cartController.addCartItem(req, res, body);
            }
        }
        if(req.method === 'GET'){
            if(pathname.endsWith('/info')){
                return cartController.getCartInfo(req, res);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Cart Route Not Found');
    } catch (error) {
        console.error('Error in cartRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};