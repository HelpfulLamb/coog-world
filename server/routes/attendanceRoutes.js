const attendanceController = require('../controllers/attendanceController.js');
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

module.exports = async function attendanceRouter(req, res){
    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;
    try {
        if(req.method === 'POST'){
            if(pathname.endsWith('/clock-in')){
                const body = await parseBody(req);
                return attendanceController.clockIn(req, res, body);
            } else if(pathname.endsWith('/clock-out')){
                const body = await parseBody(req);
                return attendanceController.clockOut(req, res, body);
            }
        }
        if(req.method === 'GET'){
            if(pathname.endsWith('/all')){
                return attendanceController.getAllAttendanceRecords(req, res);
            } else if(/\/today\/\d+$/.test(pathname)){
                const empid = pathname.split('/').pop();
                return attendanceController.getTodayAttendance(req, res, empid);
            } else if(/\/all\/\d+$/.test(pathname)){
                const empid = pathname.split('/').pop();
                return attendanceController.getAllAttendance(req, res, empid);
            }
        }
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end('Attendance Route Not Found');
    } catch (error) {
        console.error('Error in attendanceRoutes: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Internal Server Error'}));
    }
};