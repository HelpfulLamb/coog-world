const db = require('../config/db.js');

exports.findEmployeeByEmail = async (email) => {
    const [employee] = await db.query('SELECT * FROM employees WHERE Emp_email = ?', [email]);
    return employee[0];
};

exports.createEmployee = async (fname, lname, phone, email, password, section, position, salary, start_date, end_date, clock_in, clock_out, emergency_contact) => {
    const [result] = await db.query(
        'INSERT INTO employees (First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date, End_date, Emp_in, Emp_out, Emp_emer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [fname, lname, phone, email, password, section, position, salary, start_date, end_date, clock_in, clock_out, emergency_contact]
    );
    return result.insertId;
};

exports.getAllEmployees = async () => {
    const [employees] = await db.query('SELECT * FROM employees');
    return employees;
};

exports.getEmployeeById = async (id) => {
    const [employee] = await db.query('SELECT * FROM WHERE Emp_ID = ?', [id]);
    return employee[0];
};

exports.getEmployeeInfo = async (id) => {
    const [info] = await db.query('SELECT e.First_name, e.Last_name, e.Emp_phone, e.Emp_email, e.Emp_sec, e.Emp_salary, e.Start_date, o.Type FROM employees as e, occupation as o WHERE e.Emp_sec = o.Occ_ID and Emp_ID = ?', [id]);
    return info;
}

exports.deleteAllEmployees = async () => {
    await db.query('DELETE FROM employees');
};

exports.deleteEmployeeById = async (id) => {
    await db.query('DELETE FROM employees WHERE Emp_ID = ?', [id]);
};