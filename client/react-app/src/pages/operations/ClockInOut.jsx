import React, { useEffect, useState, useCallback } from 'react';

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

function formatAttendanceDate(attendanceCreated) {
    if (!attendanceCreated) return 'N/A';

    const date = new Date(attendanceCreated);

    if (isNaN(date)) {
        return 'Invalid Date';
    }

    const januaryFirst = new Date(date.getFullYear(), 0, 1);
    const isDST = date.getTimezoneOffset() < januaryFirst.getTimezoneOffset();
    const offset = isDST ? 5 : 6;

    date.setHours(date.getHours() - offset);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', { ...options, timeZone: 'America/Chicago' });
};

const ClockInOut = () => {
    const [empId, setEmpId] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState(null);
    const [allAttendance, setAllAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const id = parsedUser.Emp_ID || parsedUser.id;
            if (id) {
                setEmpId(id);
            } else {
                setStatus('Employee ID not found in user data.');
            }
        } else {
            setStatus('User not found. Please log in.');
        }
    }, []);

    const fetchTodayAttendance = useCallback(async () => {
        if (!empId) return;

        const todayDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago' });

        setLoading(true);

        try {
            const res = await fetch(`/api/attendance/today/${empId}`);
            const data = await res.json();

            if (res.ok) {
                const convertedData = {
                    ...data,
                    clock_in: data.clock_in ? formatUTCToCentralTime(data.clock_in) : null,
                    clock_out: data.clock_out ? formatUTCToCentralTime(data.clock_out) : null,
                };

                localStorage.setItem('attendance', JSON.stringify(convertedData));
                setAttendance(convertedData);
            } else {
                setAttendance(null);
                setStatus(data.error || 'No attendance records for today.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error fetching attendance. Trying cached version...');

            const cached = localStorage.getItem('attendance');
            if (cached) {
                const parsed = JSON.parse(cached);
                const parsedDate = new Date(parsed.clock_in || parsed.clock_out || parsed.Attendance_created);
                const cachedDate = parsedDate.toLocaleDateString('en-US', { timeZone: 'America/Chicago' });

                if (cachedDate === todayDate) {
                    setAttendance(parsed);
                } else {
                    setAttendance(null);
                    setStatus('Cached attendance is from a previous day.');
                }
            }
        } finally {
            setLoading(false);
        }
    }, [empId]);

    const fetchAllAttendance = useCallback(async () => {
        if (empId) {
            try {
                const res = await fetch(`/api/attendance/all/${empId}`);
                const data = await res.json();

                if (res.ok) {
                    const formatted = data.map((record) => ({
                        ...record,
                        clock_in: record.clock_in ? formatUTCToCentralTime(record.clock_in) : 'N/A',
                        clock_out: record.clock_out ? formatUTCToCentralTime(record.clock_out) : 'N/A',
                    }));

                    setAllAttendance(formatted);
                } else {
                    setAllAttendance([]);
                    setStatus(data.error || 'No past attendance records found.');
                }
            } catch (err) {
                console.error('Failed to fetch all attendance records:', err);
                setStatus('Error fetching all attendance records.');
            }
        }
    }, [empId]);

    useEffect(() => {
        if (empId) {
            fetchTodayAttendance();
            fetchAllAttendance();
        }
    }, [empId, fetchTodayAttendance, fetchAllAttendance]);

    useEffect(() => {
        let filtered = [...allAttendance];

        if (dateFromFilter) {
            filtered = filtered.filter((record) => new Date(record.Attendance_created) >= new Date(dateFromFilter));
        }
        if (dateToFilter) {
            filtered = filtered.filter((record) => new Date(record.Attendance_created) <= new Date(dateToFilter));
        }

        setFilteredAttendance(filtered);
    }, [allAttendance, dateFromFilter, dateToFilter]);

    const handleClockIn = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id;

        if (!userId) {
            setStatus('User ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/attendance/clock-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empId, userId }),
            });
            const data = await res.json();
            setStatus(data.message || data.error || 'Clock-in attempted');
            await fetchTodayAttendance();

            if (data.message === 'Clocked in successfully!') {
                const clockInTime = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

                const updatedAttendance = {
                    ...attendance,
                    clock_in: clockInTime,
                };
                localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
                setAttendance(updatedAttendance);
                setStatus('Clocked in successfully! Refreshing...');

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setStatus('Error while clocking in.');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id;

        if (!userId) {
            setStatus('User ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/attendance/clock-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empId, userId }),
            });

            const data = await res.json();
            setStatus(data.message || data.error || 'Clock-out attempted');

            if (data.message === 'Clocked out successfully.') {
                const clockOutTime = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

                const updatedAttendance = {
                    ...attendance,
                    clock_out: clockOutTime,
                };
                localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
                setAttendance(updatedAttendance);

                setAllAttendance((prevAllAttendance) =>
                    prevAllAttendance.map((record) =>
                        record.clock_in === attendance.clock_in
                            ? { ...record, clock_out: clockOutTime }
                            : record
                    )
                );
            }
        } catch (err) {
            console.error(err);
            setStatus('Error while clocking out.');
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setDateFromFilter('');
        setDateToFilter('');
    };

    if (!empId) {
        return <p>Loading employee info...</p>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Clock In / Clock Out</h2>

            <div className="attendance-wrapper">
                <div className="attendance-card single">
                    <div className="attendance-label" style={{ color: 'black' }}>Clock In</div>
                    <div className="attendance-value" style={{ color: 'black' }}>
                        {attendance?.clock_in || 'Not clocked in yet'}
                    </div>
                    <button
                        onClick={handleClockIn}
                        disabled={loading}
                        className="add-button"
                        style={{ marginTop: '1rem' }}
                    >
                        Clock In
                    </button>
                </div>

                <div className="attendance-card single">
                    <div className="attendance-label" style={{ color: 'black' }}>Clock Out</div>
                    <div className="attendance-value" style={{ color: 'black' }}>
                        {attendance?.clock_out || 'Not clocked out yet'}
                    </div>
                    <button
                        onClick={handleClockOut}
                        disabled={loading}
                        className="add-button"
                        style={{ marginTop: '1rem' }}
                    >
                        Clock Out
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <p
                    style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: status.includes('successfully') ? 'green' : 'red',
                        backgroundColor: status.includes('successfully') ? '#e9f9e3' : '#f8d7da',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        display: 'inline-block',
                        maxWidth: '80%',
                        margin: '0 auto',
                    }}
                >
                    {status}
                </p>
            </div>

            <div className="filter-controls">
                <h2>Filter Attendance Records</h2>
                <div className="filter-row">
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
                    <button onClick={resetFilters} className="reset-button">Reset Filters</button>
                </div>
            </div>

            <div className="table-container">
                {filteredAttendance.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((record, index) => (
                                <tr key={index}>
                                    <td>{formatAttendanceDate(record.Attendance_created)}</td>
                                    <td>{record.clock_in}</td>
                                    <td>{record.clock_out}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No past attendance records available.</p>
                )}
            </div>
        </div>
    );
};

export default ClockInOut;
