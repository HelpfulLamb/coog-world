const employeeModel = require('../models/employeeModel.js');

exports.createEmployee = async (req, res) => {
    const {First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date} = req.body;
    console.log('Request Body: ', req.body);
    if(!First_name || !Last_name || !Emp_phone || !Emp_email || !Emp_password || !Emp_sec || !Emp_pos || !Emp_salary || !Start_date){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingEmployee = await employeeModel.findEmployeeByEmail(Emp_email);
        if(existingEmployee){
            return res.status(400).json({message: 'An Employee account with that email already exists. Log in or try again.'});
        }
        await employeeModel.createEmployee({First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date});
        res.status(201).json({message: 'New Employee Added Successfully.'});
    } catch (error) {
        console.error('Error adding new employee: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
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
        const {Emp_ID} = req.body;
        if(!Emp_ID){
            return res.status(400).json({message: 'Invalid employee ID provided. Check server status.'});
         }
        await employeeModel.deleteEmployeeById(Emp_ID);
        res.status(200).json({message: 'Employee deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};