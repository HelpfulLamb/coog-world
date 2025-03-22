const employeeModel = require('../models/employeeModel.js');

exports.createEmployee = async (req, res) => {
    try {
        const {fname, lname, phone, email, section, position, salary, start_date, end_date, clock_in, clock_out, emergency_contact} = req.body;
        const employeeId = await employeeModel.createEmployee(emp_id, fname, lname, phone, email, section, position, location, salary, start_date, end_date, clock_in, clock_out, emergency_contact);
        res.status(201).json({id: employeeId, fname, lname, phone, email, section, position, salary, start_date, end_date, clock_in, clock_out, emergency_contact});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.loginEmployee = async (req, res) => {
    const {email, password} = req.body;
    try {
        const employee = await employeeModel.findEmployeeByEmail(email);
        if(!employee){
            return res.status(404).json({message: 'Employee not found.'});
        }
        if(employee.Emp_password !== password){
            return res.status(401).json({message: 'Invalid Password.'});
        }
        res.status(200).json({message: 'Employee Login Successful'});
    } catch (error) {
        console.error('Error during employee login: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeModel.getEmployeeById(req.params.id);
        if(!employee){
            return res.status(404).json({message: 'Employee not found'});
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getEmployeeInfo = async (req, res) => {
    try {
        const info = await employeeModel.getEmployeeInfo(req.params.id);
        if(!info){
            return res.status(404).json({message: 'Employee information not found.'});
        }
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllEmployees = async (req, res) => {
    try {
        await employeeModel.deleteAllEmployees();
        res.status(200).json({message: 'All employees deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteEmployeeById = async (req, res) => {
    try {
        await employeeModel.deleteEmployeeById(req.params.id);
        res.status(200).json({message: 'Employee deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};