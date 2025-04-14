const employeeController = require('../controllers/employeeController.js');
const express = require('express');
const employeeRouter = express.Router();

// create new employee
employeeRouter.post('/create-employee', employeeController.createEmployee);
employeeRouter.post('/login', employeeController.loginEmployee);
employeeRouter.post('/attendance-report', employeeController.getEmployeeAttendanceReport);
employeeRouter.post('/total-hours', employeeController.getTotalHoursWorked);
employeeRouter.post('/change-password', employeeController.changePassword);

// update existing employee
employeeRouter.put('/:id', employeeController.updateEmployee);

// retrieve employees (all or specific)
employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/info', employeeController.getEmployeeInfo);
employeeRouter.get('/attendance', employeeController.getEmployeeAttendance);
employeeRouter.get('/employee-show', employeeController.getEmployeeShowUps); // employees
employeeRouter.get('/employee-spread', employeeController.getParkEmployeeNumber); // get employees per area and total employees
employeeRouter.get('/summary', employeeController.getEmployeeSummary);
// make sure any route getting id stays at the bottom
employeeRouter.get('/:id', employeeController.getEmployeeById);
employeeRouter.get('/profile/:id', employeeController.getEmployeeProfile);

// delete employees (all or specific)
employeeRouter.delete('/delete-all', employeeController.deleteAllEmployees);
employeeRouter.delete('/delete-selected', employeeController.deleteEmployeeById);

module.exports = {
    employeeRouter
}