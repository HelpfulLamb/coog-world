const attendanceModel = require('../models/attendanceModel.js');

exports.clockIn = async (req, res, body) => {
    const { empId, userId } = body;
    if (!empId || !userId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Employee ID and User ID are required.' }));
    }
    try {
        const existingSession = await attendanceModel.getLastOpenSession(empId);
        if (existingSession && !existingSession.clock_out) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'You are already clocked in for today.' }));
        }
        
        const newAttendanceId = await attendanceModel.insertClockIn(empId, userId);
        res.writeHead(201, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ message: 'Clocked in successfully!', attendanceId: newAttendanceId }));
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Error clocking in.' }));
    }
};

exports.clockOut = async (req, res, body) => {
    const { empId, userId } = body;
    if (!empId || !userId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Employee ID and User ID are required.' }));
    }
    try {
        const openSession = await attendanceModel.getLastOpenSession(empId);
        if (!openSession) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'You are not clocked in.' }));
        }
        await attendanceModel.updateClockOut(openSession.Attendance_ID, userId);
        
        const updatedSession = await attendanceModel.getLastOpenSession(empId);
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Clocked out successfully.',
            updatedSession,  
        }));
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Error clocking out.' }));
    }
};

exports.getTodayAttendance = async (req, res, id) => {
    try {
        const attendanceRecords = await attendanceModel.getTodayAttendance(id);
        if (attendanceRecords.length === 0) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No attendance records for today.' }));
        }
        const latestSession = attendanceRecords[attendanceRecords.length - 1];
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(latestSession)); 
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Error fetching attendance records.' }));
    }
};

exports.getAllAttendance = async (req, res, id) => {
    if (!id) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Employee ID is required' }));
    }
    try {
        const results = await attendanceModel.getAllAttendanceByEmpId(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(results));
    } catch (err) {
        console.error('Error fetching all attendance records:', err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Database error' }));
    }
};

exports.getAllAttendanceRecords = async (req, res) => {
    try {
        const results = await attendanceModel.getAllAttendance();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(results));
    } catch (err) {
        console.error('Error fetching all attendance records:', err.message); 
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Database error' }));
    }
};