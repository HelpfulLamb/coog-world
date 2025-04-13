const express = require('express');
const attendanceRouter = express.Router();
const attendanceController = require('../controllers/attendanceController.js');

attendanceRouter.post('/clock-in', attendanceController.clockIn);
attendanceRouter.post('/clock-out', attendanceController.clockOut);

attendanceRouter.get('/today/:empId', attendanceController.getTodayAttendance);
attendanceRouter.get('/all/:empId', attendanceController.getAllAttendance);

module.exports = {
    attendanceRouter
}