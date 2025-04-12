const employeeController = require('../controllers/employeeController.js');
const express = require('express');
const employeeRouter = express.Router();

// create new employee
employeeRouter.post('/create-employee', employeeController.createEmployee);
employeeRouter.post('/login', employeeController.loginEmployee);

// update existing employee
employeeRouter.put('/:id', employeeController.updateEmployee);

// retrieve employees (all or specific)
employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/info', employeeController.getEmployeeInfo);
employeeRouter.get('/attendance', employeeController.getEmployeeAttendance);
employeeRouter.get('/total-hours', employeeController.getTotalHoursWorked);
employeeRouter.get('/employee-show', employeeController.getEmployeeShowUps);
employeeRouter.get('/summary', employeeController.getEmployeeSummary);
// make sure any route getting id stays at the bottom
employeeRouter.get('/:id', employeeController.getEmployeeById);

// delete employees (all or specific)
employeeRouter.delete('/delete-all', employeeController.deleteAllEmployees);
employeeRouter.delete('/delete-selected', employeeController.deleteEmployeeById);

module.exports = {
    employeeRouter
}