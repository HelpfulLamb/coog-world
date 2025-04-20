const employeeController = require('../controllers/employeeController.js');
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

module.exports = async function employeeRouter(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    try {
        if (req.method === 'POST') {
            if (pathname.endsWith('/create-employee')) {
                const body = await parseBody(req);
                return employeeController.createEmployee(req, res, body);
            } else if (pathname.endsWith('/login')) {
                const body = await parseBody(req);
                return employeeController.loginEmployee(req, res, body);
            } else if (pathname.endsWith('/attendance-report')) {
                const body = await parseBody(req);
                return employeeController.getEmployeeAttendanceReport(req, res, body);
            } else if (pathname.endsWith('/total-hours')) {
                const body = await parseBody(req);
                return employeeController.getTotalHoursWorked(req, res, body);
            } else if (pathname.endsWith('/change-password')) {
                const body = await parseBody(req);
                return employeeController.changePassword(req, res, body);
            }
        }
        if (req.method === 'PUT' && /^\/api\/employees\/\d+$/.test(pathname)) {
            const body = await parseBody(req);
            const id = pathname.split('/').pop();
            return employeeController.updateEmployee(req, res, id, body);
        }
        if (req.method === 'GET') {
            if (pathname === '/api/employees') {
                return employeeController.getAllEmployees(req, res);
            } else if (pathname.endsWith('/info')) {
                return employeeController.getEmployeeInfo(req, res);
            } else if (pathname.endsWith('/attendance')) {
                const body = await parseBody(req);
                return employeeController.getEmployeeAttendance(req, res, body);
            } else if (pathname.endsWith('/employee-show')) {
                const body = await parseBody(req);
                return employeeController.getEmployeeShowUps(req, res, body);
            } else if (pathname.endsWith('/employee-spread')) {
                return employeeController.getParkEmployeeNumber(req, res);
            } else if (pathname.endsWith('/summary')) {
                const body = await parseBody(req);
                return employeeController.getEmployeeSummary(req, res, body);
            } else if (/\/profile\/\d+$/.test(pathname)) {
                const id = pathname.split('/').pop();
                return employeeController.getEmployeeProfile(req, res, id);
            } else if (/\/api\/employees\/\d+$/.test(pathname)) {
                const id = pathname.split('/').pop();
                return employeeController.getEmployeeById(req, res, id);
            } else if (pathname.endsWith('/salaries')) {
                return employeeController.getEmployeesSalary(req, res);
            }
        }
        if (req.method === 'DELETE') {
            if (pathname.endsWith('/delete-all')) {
                return employeeController.deleteAllEmployees(req, res);
            } else if (pathname.endsWith('/delete-selected')) {
                const body = await parseBody(req);
                return employeeController.deleteEmployeeById(req, res, body);
            }
        }
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('Employee Route Not Found');
    } catch (error) {
        console.error('Error in employeeRoutes: ', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};