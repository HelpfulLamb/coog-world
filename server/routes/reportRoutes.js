const reportController = require('../controllers/reportController.js');
const url = require('url');

module.exports = async function reportRoutes(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'GET'){
            if(pathname.endsWith('/rainouts')){
                return reportController.getRainoutsReport(req, res);
            } else if(pathname.endsWith('/rainout-rows')){
                return reportController.getRainoutRows(req, res);
            } else if(pathname.endsWith('/revenue')){
                return reportController.getRevenueReport(req, res);
            } else if(pathname.endsWith('/revenue-summary')){
                return reportController.getRevenueSummary(req, res);
            } else if(pathname.endsWith('/open-maintenance-count')){
                return reportController.getOpenMaintenanceCount(req, res);
            } else if(pathname.endsWith('/tickets-today')){
                return reportController.getTicketsSoldToday(req, res);
            } else if(pathname.endsWith('/revenue-details')){
                return reportController.getRevenueDetails(req, res);
            } else if(pathname.endsWith('/visitors-today')){
                return reportController.getTotalVisitorsToday(req, res);
            } else if(pathname.endsWith('/ticket-sales')){
                return reportController.getTicketSalesReport(req, res);
            } else if(pathname.endsWith('/customer-counts')){
                return reportController.getCustomerCounts(req, res);
            } else if(pathname.endsWith('/customer-stats')){
                return reportController.getCustomerStats(req, res);
            } else if(pathname.endsWith('/ticket-sales-trends')){
                return reportController.getTicketSalesTrends(req, res);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Report Route Not Found');
    } catch (error) {
        console.error('Error in reportRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};