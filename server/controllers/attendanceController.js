const attendanceModel = require('../models/attendanceModel.js');

exports.clockIn = async (req, res, body) => {
    const { empId, userId } = body;
    if (!empId || !userId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Employee ID and User ID are required.' }));
    }
    try {
        // Check if there's an open session for today
        const existingSession = await attendanceModel.getLastOpenSession(empId);
        if (existingSession && !existingSession.clock_out) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'You are already clocked in for today.' }));
        }
        // If no open session, insert a new clock-in
        const newAttendanceId = await attendanceModel.insertClockIn(empId, userId);
        res.writeHead(201, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ message: 'Clocked in successfully!', attendanceId: newAttendanceId }));
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Error clocking in.' }));
    }
};

// Clock-out function
exports.clockOut = async (req, res, body) => {
    const { empId, userId } = body;
    if (!empId || !userId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Employee ID and User ID are required.' }));
    }
    try {
        // Get the last open session (clocked-in session)
        const openSession = await attendanceModel.getLastOpenSession(empId);
        if (!openSession) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'You are not clocked in.' }));
        }
        // Update the clock-out time
        await attendanceModel.updateClockOut(openSession.Attendance_ID, userId);
        // Fetch the updated session (with clock-out time)
        const updatedSession = await attendanceModel.getLastOpenSession(empId);
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Clocked out successfully.',
            updatedSession,  // Send the updated session details back to the frontend
        }));
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Error clocking out.' }));
    }
};

exports.getTodayAttendance = async (req, res, id) => {
    try {
        // Fetch today's attendance records for the employee
        const attendanceRecords = await attendanceModel.getTodayAttendance(id);
        if (attendanceRecords.length === 0) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No attendance records for today.' }));
        }
        // Return the last clock-in session (most recent one)
        const latestSession = attendanceRecords[attendanceRecords.length - 1];
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(latestSession)); // Return the latest session for today (clock-in and clock-out)
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
        console.error('Error fetching all attendance records:', err.message); // This shows specific error
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Database error' }));
    }
};