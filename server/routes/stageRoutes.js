const stageController = require('../controllers/stageController.js');
const url = require('url');

function parseBody(req) {
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

module.exports = async function stageRouter(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    try {
        if (req.method === 'POST') {
            if (pathname.endsWith('/add')) {
                const body = await parseBody(req);
                return stageController.addStage(req, res, body);
            }
        }
        if (req.method === 'PUT') {
            if (/\/update\/\d+$/.test(pathname)) {
                const body = await parseBody(req);
                const id = pathname.split('/').pop();
                return stageController.updateStage(req, res, id, body);
            }
        }
        if (req.method === 'GET') {
            if (pathname.endsWith('/all')) {
                return stageController.getStages(req, res);
            } else if (pathname.endsWith('/cost')) {
                return stageController.getStagesTotalCost(req, res);
            }
        }
        if (req.method === 'DELETE') {
            if (/\/delete\/\d+$/.test(pathname)) {
                const id = pathname.split('/').pop();
                return stageController.deleteStage(req, res, id);
            }
        }
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('Stage Route Not Found');
    } catch (error) {
        console.error('Error in stageRoutes: ', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};