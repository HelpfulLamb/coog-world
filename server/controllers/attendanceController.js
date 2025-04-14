const attendanceModel = require('../models/attendanceModel.js');

exports.clockIn = async (req, res) => {
  const { empId, userId } = req.body;

  if (!empId || !userId) {
    return res.status(400).json({ error: 'Employee ID and User ID are required.' });
  }

  try {
    // Check if there's an open session for today
    const existingSession = await attendanceModel.getLastOpenSession(empId);

    if (existingSession && !existingSession.clock_out) {
      return res.status(400).json({ error: 'You are already clocked in for today.' });
    }

    // If no open session, insert a new clock-in
    const newAttendanceId = await attendanceModel.insertClockIn(empId, userId);
    return res.status(201).json({ message: 'Clocked in successfully!', attendanceId: newAttendanceId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error clocking in.' });
  }
};

// Clock-out function
exports.clockOut = async (req, res) => {
  const { empId, userId } = req.body;

  if (!empId || !userId) {
    return res.status(400).json({ error: 'Employee ID and User ID are required.' });
  }

  try {
    // Get the last open session (clocked-in session)
    const openSession = await attendanceModel.getLastOpenSession(empId);

    if (!openSession) {
      return res.status(400).json({ error: 'You are not clocked in.' });
    }

    // Update the clock-out time
    await attendanceModel.updateClockOut(openSession.Attendance_ID, userId);

    // Fetch the updated session (with clock-out time)
    const updatedSession = await attendanceModel.getLastOpenSession(empId);

    return res.status(200).json({
      message: 'Clocked out successfully.',
      updatedSession,  // Send the updated session details back to the frontend
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error clocking out.' });
  }
};
exports.getTodayAttendance = async (req, res) => {
  const { empId } = req.params; // Get Emp_ID from the route params

  try {
    // Fetch today's attendance records for the employee
    const attendanceRecords = await attendanceModel.getTodayAttendance(empId);

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ error: 'No attendance records for today.' });
    }

    // Return the last clock-in session (most recent one)
    const latestSession = attendanceRecords[attendanceRecords.length - 1];
    return res.status(200).json(latestSession); // Return the latest session for today (clock-in and clock-out)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching attendance records.' });
  }
};

exports.getAllAttendance = async (req, res) => {
  const empId = req.params.empId;

  if (!empId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  try {
    const results = await attendanceModel.getAllAttendanceByEmpId(empId);
    res.json(results);
  } catch (err) {
    console.error('Error fetching all attendance records:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const results = await attendanceModel.getAllAttendance();
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching all attendance records:', err.message); // This shows specific error
    res.status(500).json({ error: 'Database error' });
  }
};