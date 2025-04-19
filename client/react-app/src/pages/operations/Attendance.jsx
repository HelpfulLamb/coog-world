import React, { useEffect, useState, useCallback } from 'react';
import './Report.css';

function formatUTCToCentralTime(mysqlDatetime) {
    if (!mysqlDatetime) return 'N/A';

    const date = new Date(mysqlDatetime);

    if (isNaN(date)) {
        return 'Invalid Date';
    }

    const januaryFirst = new Date(date.getFullYear(), 0, 1);
    const isDST = date.getTimezoneOffset() < januaryFirst.getTimezoneOffset();
    const offset = isDST ? 5 : 6;

    date.setHours(date.getHours() - offset);

    return date.toLocaleString('en-US', { timeZone: 'America/Chicago' });
}

function formatDate(datetime) {
    if (!datetime) return 'N/A';
  
    const formattedDate = formatUTCToCentralTime(datetime);
    return formattedDate.split(',')[0]; // Extracts only the date part (YYYY-MM-DD)
}

function formatTime(datetime) {
    if (!datetime) return 'N/A';

    const formattedTime = formatUTCToCentralTime(datetime);
    return formattedTime.split(',')[1].trim(); // Extracts only the time part (HH:MM:SS)
}

const AllAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [status, setStatus] = useState('Loading...');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/attendance/all');
      const data = await res.json();

      if (res.ok) {
        setAttendanceData(data);
        setFilteredAttendance(data); // Initially, show all attendance data
        setStatus('');
      } else {
        setStatus(data.error || 'Failed to load records.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error fetching attendance data.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...attendanceData];

    // Filter by employee name if any
    if (employeeFilter) {
      filtered = filtered.filter((record) =>
        `${record.employee_first_name} ${record.employee_last_name}`
          .toLowerCase()
          .includes(employeeFilter.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFromFilter) {
      filtered = filtered.filter(
        (record) => new Date(record.Attendance_created) >= new Date(dateFromFilter)
      );
    }

    if (dateToFilter) {
      filtered = filtered.filter(
        (record) => new Date(record.Attendance_created) <= new Date(dateToFilter)
      );
    }

    setFilteredAttendance(filtered);
  }, [attendanceData, employeeFilter, dateFromFilter, dateToFilter]);

  const resetFilters = () => {
    setDateFromFilter('');
    setDateToFilter('');
    setEmployeeFilter('');
  };

  return (
    <>
      <h2 style={{ marginBottom: '2rem' }}>
        All Employee Attendance
      </h2>

      <div className="filter-controls" style={{ marginBottom: '2rem' }}>
        <h2>Filter Attendance Records</h2>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="employeeFilter">Employee:</label>
            <input
              type="text"
              id="employeeFilter"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              placeholder="Search by employee"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateFrom">From Date:</label>
            <input
              type="date"
              id="dateFrom"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateTo">To Date:</label>
            <input
              type="date"
              id="dateTo"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>

          <button onClick={resetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        {filteredAttendance.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record, idx) => (
                <tr key={idx}>
                  <td>{`${record.employee_first_name} ${record.employee_last_name}`}</td>
                  <td>{formatDate(record.Attendance_created)}</td>
                  <td>{formatTime(record.clock_in)}</td>
                  <td>{formatTime(record.clock_out)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records found with the selected filters.</p>
        )}
      </div>
    </>
  );
};

export default AllAttendance;
