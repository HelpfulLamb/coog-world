const employeeController = require('../controllers/employeeController.js');
const express = require('express');
const employeeRouter = express.Router();

// create new employee
employeeRouter.post('/create-employee', employeeController.createEmployee);
employeeRouter.post('/login', employeeController.loginEmployee);

// retrieve employees (all or specific)
employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/info', employeeController.getEmployeeInfo);
employeeRouter.get('/:id', employeeController.getEmployeeById);

// delete employees (all or specific)
employeeRouter.delete('/delete-all', employeeController.deleteAllEmployees);
employeeRouter.delete('/delete-selected', employeeController.deleteEmployeeById);

module.exports = {
    employeeRouter
}