const db = require('../config/db.js');

exports.getLastOpenSession = async (empId) => {
  const [rows] = await db.query(
    `SELECT * FROM attendance 
     WHERE Emp_ID = ? AND clock_out IS NULL 
     ORDER BY clock_in DESC LIMIT 1`,
    [empId]
  );
  return rows[0];
};
exports.insertClockIn = async (empId, userId) => {
  const [result] = await db.query(
    `INSERT INTO attendance (Emp_ID, clock_in, Attendance_created, Attendance_created_by) 
     VALUES (?, NOW(), NOW(), ?)`,
    [empId, userId]
  );
  return result.insertId;
};
exports.updateClockOut = async (attendanceId, userId) => {
  const [result] = await db.query(
    `UPDATE attendance 
     SET clock_out = NOW(), Attendance_updated = NOW(), Attendance_updated_by = ?
     WHERE Attendance_ID = ?`,
    [userId, attendanceId]
  );
  return result;
};
exports.getTodayAttendance = async (empId) => {
  const [rows] = await db.query(
    `SELECT * FROM attendance 
       WHERE Emp_ID = ? 
       AND DATE(clock_in) = CURDATE()`,
    [empId]
  );
  return rows;
};

exports.getAllAttendanceByEmpId = async (empId) => {
  const [rows] = await db.query(
    `SELECT Attendance_ID, Emp_ID, clock_in, clock_out, Attendance_created, Attendance_updated
       FROM attendance
       WHERE Emp_ID = ?
       ORDER BY Attendance_created DESC`,
    [empId]
  );
  return rows;
};

exports.getAllAttendance = async () => {
  const [rows] = await db.query(
    `SELECT a.Attendance_ID, a.Emp_ID, a.clock_in, a.clock_out, a.Attendance_created, a.Attendance_updated,
              e.First_name AS employee_first_name, e.Last_name AS employee_last_name
       FROM attendance a
       JOIN employees e ON a.Emp_ID = e.Emp_ID
       ORDER BY a.Attendance_created DESC`
  );
  return rows;
};