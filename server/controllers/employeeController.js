const { Employee } = require('../models/employeeModel.js');

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(employees));
    } catch (error) {
        console.error('Error fetching employees: ', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
};

module.exports = {
    getEmployees
}