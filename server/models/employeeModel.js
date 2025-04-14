const db = require('../config/db.js');

exports.findEmployeeByEmail = async (email) => {
    const [employee] = await db.query('SELECT e.*, o.Occ_name FROM employees as e, occupation as o WHERE Emp_email = ? and o.Occ_ID = e.Emp_pos', [email]);
    return employee[0];
};

exports.createEmployee = async (employeeData) => {
    const {First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date} = employeeData;
    await db.query(
        'INSERT INTO employees (First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [First_name, Last_name, Emp_phone, Emp_email, Emp_password, Emp_sec, Emp_pos, Emp_salary, Start_date]
    );
};

exports.updateEmployee = async (selectedEmp) => {
    const {Emp_ID, First_name, Last_name, Emp_phone, Emp_email, Emp_sec, Emp_pos, Emp_salary, End_date} = selectedEmp;
    const [emp] = await db.query(
        'UPDATE employees SET First_name = ?, Last_name = ?, Emp_phone = ?, Emp_email = ?, Emp_sec = ?, Emp_pos = ?, Emp_salary = ?, End_date = ? WHERE Emp_ID = ?',
    [First_name, Last_name, Emp_phone, Emp_email, Emp_sec, Emp_pos, Emp_salary, End_date, Emp_ID]);
    return emp;
};

exports.getAllEmployees = async () => {
    const [employees] = await db.query('SELECT * FROM employees');
    return employees;
};

exports.getEmployeeById = async (id) => {
    const [employee] = await db.query('SELECT * FROM employees WHERE Emp_ID = ?', [id]);
    return employee[0];
};

exports.getEmployeeInfo = async () => {
    const [info] = await db.query(
        'SELECT e.Emp_ID, e.First_name, e.Last_name, e.Emp_email, s.area_name, o.Occ_name, e.Emp_salary, e.Start_date FROM employees as e, sectors as s, occupation as o WHERE e.Emp_sec = s.area_id and e.Emp_pos = o.Occ_ID and e.Emp_pos < 9 ORDER BY e.Start_date DESC');
    return info;
}

exports.getEmployeeProfile = async (empId) => {
    const [rows] = await db.query(`
        SELECT 
            e.Emp_ID, 
            e.First_name, 
            e.Last_name, 
            e.Emp_email, 
            e.Emp_salary, 
            e.Start_date, 
            s.area_name AS sector, 
            o.Occ_name AS position,
            (
                SELECT clock_in 
                FROM attendance 
                WHERE Emp_ID = e.Emp_ID 
                ORDER BY Attendance_created DESC 
                LIMIT 1
            ) AS clock_in,
            (
                SELECT clock_out 
                FROM attendance 
                WHERE Emp_ID = e.Emp_ID 
                ORDER BY Attendance_created DESC 
                LIMIT 1
            ) AS clock_out
        FROM employees e
        JOIN sectors s ON e.Emp_sec = s.area_id
        JOIN occupation o ON e.Emp_pos = o.Occ_ID
        WHERE e.Emp_ID = ?
        LIMIT 1
    `, [empId]);

    return rows[0];
};

exports.deleteAllEmployees = async () => {
    await db.query('DELETE FROM employees');
};

exports.deleteEmployeeById = async (empid) => {
    await db.query('DELETE FROM employees WHERE Emp_ID = ?', [empid]);
};
exports.updateEmployeePassword = async (empId, newPassword) => {
    const [result] = await db.query(
        'UPDATE employees SET Emp_password = ? WHERE Emp_ID = ?',
        [newPassword, empId]
    );
    return result;
};
exports.updatePassword = async (empId, newPassword) => {
    await db.query('UPDATE employees SET Emp_password = ? WHERE Emp_ID = ?', [newPassword, empId]);
  };
  