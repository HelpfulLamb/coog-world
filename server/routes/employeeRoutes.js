const employeeController = require('../controllers/employeeController.js');
const express = require('express');
const employeeRouter = express.Router();

// create new employee
employeeRouter.post('/', employeeController.createEmployee);
employeeRouter.post('/login', employeeController.loginEmployee);

// retrieve employees (all or specific)
employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/:id', employeeController.getEmployeeById);
employeeRouter.get('/info/:id', employeeController.getEmployeeInfo);

// delete employees (all or specific)
employeeRouter.delete('/', employeeController.deleteAllEmployees);
employeeRouter.delete('/:id', employeeController.deleteEmployeeById);

module.exports = {
    employeeRouter
}