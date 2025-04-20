const visitorController = require('../controllers/visitorController.js');
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

module.exports = async function visitorRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/register')){
                const body = await parseBody(req);
                return visitorController.registerUser(req, res, body);
            } else if(pathname.endsWith('/login')){
                const body = await parseBody(req);
                return visitorController.loginUser(req, res, body);
            }
        }
        if(req.method === 'PUT'){
            if(/^\/api\/users\/\d+$/.test(pathname)){
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return visitorController.updateVisitor(req, res, id, body);
            } else if(/\/update\/\d+$/.test(pathname)){
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return visitorController.updateVisitorInfo(req, res, id, body);
            }
        }
        if(req.method === 'GET'){
            if(pathname === '/api/users'){
                return visitorController.getAllUsers(req, res);
            } else if(pathname.endsWith('/info')){
                return visitorController.getUserInfo(req, res);
            } else if(/\/api\/users\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return visitorController.getUserById(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return visitorController.deleteAllUsers(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return visitorController.deleteUserById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Visitor Route Not Found');
    } catch (error) {
        console.error('Error in visitorRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};