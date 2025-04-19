const { json } = require('stream/consumers');
const showController = require('../controllers/showController.js');
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

module.exports = async function showRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-show')){
                const body = await parseBody(req);
                return showController.createShow(req, res, body);
            } else if(pathname.endsWith('/log')){
                const body = await parseBody(req);
                return showController.logVisitorShow(req, res, body);
            } else if(pathname.endsWith('/top-shows')){
                const body = await parseBody(req);
                return showController.getTopShows(req, res, body);
            }
        }
        if(req.method === 'PUT' && /^\/api\/shows\/\d+$/.test(pathname)){
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return showController.updateShow(req, res, id, body);
        }
        if(req.method === 'GET'){
            if(pathname === '/api/shows'){
                return showController.getAllShows(req, res);
            } else if(pathname.endsWith('/user-view')){
                return showController.getShowForCard(req, res);
            } else if(pathname.endsWith('/info')){
                return showController.getShowInfo(req, res);
            } else if(pathname.endsWith('/today-show')){
                return showController.getPopularShowToday(req, res);
            } else if(/\/history\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return showController.getVisitorShowHistory(req, res, id);
            } else if(/\/api\/shows\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return showController.getShowById(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return showController.deleteAllShows(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return showController.deleteShowById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Show Route Not Found'}));
    } catch (error) {
        console.error('Error in showRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};