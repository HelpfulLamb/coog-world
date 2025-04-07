const db = require('../config/db.js');

exports.findEmployeeByEmail = async (email) => {
    const [employee] = await db.query('SELECT * FROM employees WHERE Emp_email = ?', [email]);
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
    const [employee] = await db.query('SELECT * FROM WHERE Emp_ID = ?', [id]);
    return employee[0];
};

exports.getEmployeeInfo = async () => {
    const [info] = await db.query(
        'SELECT e.Emp_ID, e.First_name, e.Last_name, e.Emp_email, s.area_name, o.Occ_name, e.Emp_salary, e.Start_date FROM employees as e, sectors as s, occupation as o WHERE e.Emp_sec = s.area_id and e.Emp_pos = o.Occ_ID and e.Emp_pos < 9 ORDER BY e.Emp_ID');
    return info;
}

exports.deleteAllEmployees = async () => {
    await db.query('DELETE FROM employees');
};

exports.deleteEmployeeById = async (empid) => {
    await db.query('DELETE FROM employees WHERE Emp_ID = ?', [empid]);
};
