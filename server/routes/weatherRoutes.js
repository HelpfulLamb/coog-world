const weatherController = require('../controllers/weatherController.js');
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

module.exports = async function weatherRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-weather')){
                const body = await parseBody(req);
                return weatherController.createWeather(req, res, body);
            }
        }
        if(req.method === 'PUT' && /^\/api\/weather\/\d+$/.test(pathname)){
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return weatherController.updateWeather(req, res, id, body);
        }
        if(req.method === 'PATCH' && /^\/api\/weather\/weather-alerts\/\d+\/acknowledge$/.test(pathname)){
            const id = pathname.split('/')[4];
            return weatherController.markMessageSeen(req, res, id);
        }
        if(req.method === 'GET'){
            if(pathname === '/api/weather'){
                return weatherController.getAllWeather(req, res);
            } else if(pathname.endsWith('/weather-alerts')){
                return weatherController.getWeatherAlerts(req, res);
            } else if(pathname.endsWith('/info')){
                return weatherController.getWeatherInfo(req, res);
            } else if(pathname.endsWith('/today')){
                return weatherController.getLatestWeather(req, res);
            } else if(/\/api\/weather\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return weatherController.getWeatherById(req, res, id);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return weatherController.deleteAllWeather(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return weatherController.deleteWeatherById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Weather Route Not Found');
    } catch (error) {
        console.error('Error in weatherRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};