const employeeModel = require('../models/employeeModel.js');
const db = require('../config/db.js');

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

exports.updateEmployee = async (req, res) => {
    try {
        const empID = req.params.id;
        const updatedData = req.body;
        const selectedEmp = {...updatedData, Emp_ID: empID};
        const updatedEmp = await employeeModel.updateEmployee(selectedEmp);
        if(!updatedEmp){
            return res.status(404).json({message: 'Employee not found or not updated.'});
        }
        res.status(200).json({message: 'Employee updated successfully.', employee: updatedData});
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
        res.status(200).json({id: employee.Emp_ID, fname: employee.First_name, lname: employee.Last_name, email: employee.Emp_email, role: employee.Occ_name,});
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

exports.getEmployeeAttendance = async (req, res) => {
    const {startDate, endDate} = req.body;
    try {
        const [data] = await db.query(
            `SELECT 
            e.Emp_ID, 
            CONCAT(e.First_name, ' ', e.Last_name) AS name, 
            COUNT(a.Attendance_ID) AS days_present,
            MIN(a.clock_in) AS first_attendance,
            MAX(a.clock_in) AS last_attendance
            FROM employees AS e
            JOIN attendance a ON e.Emp_ID = a.Emp_ID
            WHERE a.clock_in BETWEEN ? AND ?
            GROUP BY e.Emp_ID`, 
            [startDate, endDate]);
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getTotalHoursWorked = async (req, res) => {
    try {
        const {startDate, endDate, Emp_ID, minHours, maxHours} = req.body;
        let query = `
        SELECT
        e.Emp_ID,
        CONCAT(e.First_name, ' ', e.Last_name) AS name,
        ROUND(SUM(TIMESTAMPDIFF(MINUTE, a.clock_in, a.clock_out)) / 60, 2) AS total_hours_worked
        FROM employees e
        JOIN attendance a ON e.Emp_ID = a.Emp_ID
        WHERE 1=1`;
        const params = [];
        if(startDate){
            query += ` AND a.clock_in >= ?`;
            params.push(startDate);
        }
        if(endDate){
            query += ` AND a.clock_out <= ?`;
            params.push(endDate);
        }
        if(Emp_ID){
            query += ` AND e.Emp_ID = ?`;
            params.push(Emp_ID);
        }
        query += ` GROUP BY e.Emp_ID`;
        if(minHours){
            query += ` HAVING total_hours_worked >= ?`;
            params.push(minHours);
        }
        if(maxHours){
            query += (minHours ? ` AND` : ` HAVING`) + ` total_hours_worked <= ?`;
            params.push(maxHours);
        }
        query += ` ORDER BY total_hours_worked DESC`;
        const [data] = await db.query(query, params);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error generating hours summary:", error);
        res.status(500).json({message: `Server error while generating hours summary: ${error.message}`});
    }
};

exports.getEmployeeShowUps = async (req, res) => {
    const {startDate, endDate} = req.body;
    try {
        const [data] = await db.query(
            `SELECT
            DATE(clock_in) AS day,
            COUNT(DISTINCT Emp_ID) AS employee_present
            FROM attendance
            WHERE clock_in BETWEEN ? AND ?
            GROUP BY DATE(clock_in)
            ORDER BY day`, 
            [startDate, endDate]);
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getEmployeeSummary = async (req, res) => {
    const {startDate, endDate} = req.body;
    try {
        const [data] = await db.query(
            `SELECT
            e.Emp_ID,
            CONCAT(e.First_name, ' ', e.Last_name) AS name,
            e.Emp_pos,
            a.area_ID,
            IF(att.Attendance_ID IS NOT NULL, 'Yes', 'No') AS attended,
            ROUND(TIMESTAMPDIFF(MINUTE, att.clock_in, att.clock_out)/60, 2) AS hours_worked
            FROM employees as e
            JOIN assignments a
            ON e.Emp_ID = a.Emp_ID
            AND ? BETWEEN a.assign_start_date AND IFNULL(a.assign_end_date, '9999-12-31')
            LEFT JOIN attendance att
            ON e.Emp_ID = att.Emp_ID
            AND DATE(att.clock_in) = ?
            ORDER BY a.area_ID, e.Emp_pos`, 
            [startDate, endDate]);
        res.status(200).json({data});
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

exports.getEmployeeAttendanceReport = async (req, res) => {
    try {
        const {startDate, endDate, Emp_ID, area_ID, status, clockType} = req.body;
        let query = `
    SELECT
        e.Emp_ID,
        CONCAT(e.First_name, ' ', e.Last_name) AS name,
        s.area_name,
        assign.assign_start_date AS day,
        a.clock_in,
        a.clock_out,
        ROUND(TIMESTAMPDIFF(MINUTE, a.clock_in, a.clock_out)/60, 2) AS hours_worked,
        CASE 
            WHEN a.Attendance_ID IS NOT NULL THEN 'Present'
            ELSE 'Absent'
        END AS status
    FROM assignments assign
    JOIN employees e ON assign.Emp_ID = e.Emp_ID
    JOIN sectors s ON assign.area_ID = s.area_ID
    LEFT JOIN attendance a ON
        a.Emp_ID = assign.Emp_ID 
        AND DATE(a.clock_in) = assign.assign_start_date
    WHERE 1=1`;
    const params = [];
    if(startDate){
        query += ` AND assign.assign_start_date >= ?`;
        params.push(startDate);
    }
    if(endDate){
        query += ` AND assign.assign_start_date <= ?`;
        params.push(endDate);
    }
    if(Emp_ID){
        query += ` AND e.Emp_ID = ?`;
        params.push(Emp_ID);
    }
    if(area_ID){
        query += ` AND s.area_ID = ?`;
        params.push(area_ID);
    }
    if(status){
        if(status === 'Present'){
            query += ` AND a.Attendance_ID IS NOT NULL`;
        } else if(status === 'Absent'){
            query += ` AND a.Attendance_ID IS NULL`;
        }
    }
    if(clockType === 'clockin'){
        query += ` AND a.clock_in IS NOT NULL`;
    } else if(clockType === 'clockout'){
        query += ` AND a.clock_out IS NOT NULL`;
    }
    query += ` ORDER BY assign.assign_start_date DESC`;
        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({message: `Server error while generating attendance report: ${error.message}`});
    }
};

exports.getParkEmployeeNumber = async (req, res) => {
    try {
        const [data] = await db.query(
            `SELECT
            s.area_name AS park_area,
            COUNT(*) AS total_area_emp,
            MIN(e.Start_date) AS earliest_hire,
            MAX(e.Start_date) AS latest_hire,
            COUNT(CASE WHEN e.End_date IS NULL THEN 1 END) AS currently_active
            FROM employees e
            JOIN sectors s ON e.Emp_sec = s.area_ID
            WHERE e.Emp_sec != 5
            GROUP BY s.area_name
            
            UNION ALL
            
            SELECT
            'All' AS park_area,
            COUNT(*) AS total_area_emp,
            MIN(Start_date) AS earliest_hire,
            MAX(Start_date) AS latest_hire,
            COUNT(CASE WHEN End_date IS NULL THEN 1 END) AS currently_active
            FROM employees
            WHERE Emp_sec != 5`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};