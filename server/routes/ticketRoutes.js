const ticketController = require('../controllers/ticketController.js');
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

module.exports = async function ticketRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/create-ticket')){
                const body = await parseBody(req);
                return ticketController.createTicket(req, res, body);
            } else if(pathname.endsWith('/purchase')){
                const body = await parseBody(req);
                return ticketController.purchaseTicket(req, res, body);
            }
        }
        if(req.method === 'PUT' && /^\/api\/ticket-type\/\d+$/.test(pathname)){
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return ticketController.updateTicket(req, res, id, body);
        }
        if(req.method === 'GET'){
            if(pathname === '/api/ticket-type'){
                return ticketController.getAllTickets(req, res);
            } else if(pathname.endsWith('/info')){
                return ticketController.getTicketInfo(req, res);
            } else if(/\/purchases\/\d+$/.test(pathname)){
                const id = pathname.split('/').pop();
                return ticketController.getUserTicketPurchases(req, res, id);
            } else if(/\/api\/ticket-type\/\d+$/.test(pathname)){
                const num = pathname.split('/').pop();
                return ticketController.getTicketByNum(req, res, num);
            }
        }
        if(req.method === 'DELETE'){
            if(pathname.endsWith('/delete-all')){
                return ticketController.deleteAllTickets(req, res);
            } else if(pathname.endsWith('/delete-selected')){
                const body = await parseBody(req);
                return ticketController.deleteTicketById(req, res, body);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Ticket Route Not Found');
    } catch (error) {
        console.error('Error in ticketRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};