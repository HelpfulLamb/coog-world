import { useState, useEffect } from "react";

export function EmployeeHours(){
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        Emp_ID: '',
        minHours: '',
        maxHours: ''
    });
    const [reportData, setReportData] = useState([]);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };
    const fetchHours = async () => {
        try {
            const response = await fetch('/api/employees/total-hours', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(filters),
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report: ', error);
        }
    };
    const clearFilters = () => {
        setFilters({
          startDate: '',
          endDate: '',
          Emp_ID: '',
          minHours: '',
          maxHours: ''
        });
        setReportData([]);
    };
    return(
        <div>
            <h2>Employee Work Hours</h2>
            <div className="filter-controls">
                <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                <input type="text" name="Emp_ID" placeholder="Employee ID" value={filters.Emp_ID} onChange={handleChange} />
                <input type="number" step='0.01' name="minHours" placeholder="Min Hours" value={filters.minHours} onChange={handleChange} />
                <input type="number" step='0.01' name="maxHours" placeholder="Max Hours" value={filters.maxHours} onChange={handleChange} />
            </div>
            <button onClick={fetchHours}>Generate Report</button>
            <button onClick={clearFilters}>Clear</button>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Emp ID</th>
                            <th>Name</th>
                            <th>Total Hours Worked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? (
                            reportData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Emp_ID}</td>
                                    <td>{row.name}</td>
                                    <td>{row.total_hours_worked}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>No Results Found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function EmployeeNumbers(){
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchEmpNum = async () => {
            try {
                const response = await fetch('/api/employees/employee-spread');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching employee numbers: ', error);
            }
        };
        fetchEmpNum();
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div>
            <h2>Number of Employees Per Area</h2>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Park Area</th>
                            <th>Total Employees</th>
                            <th>Earliest Hire</th>
                            <th>Latest Hire</th>
                            <th>Currently Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.park_area}</td>
                                <td>{row.total_area_emp}</td>
                                <td>{formatDate(row.earliest_hire)}</td>
                                <td>{formatDate(row.latest_hire)}</td>
                                <td>{row.currently_active}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AttendanceReport(){
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        Emp_ID: '',
        area_ID: '',
        status: '',
        clockType: ''
    });
    const [reportData, setReportData] = useState([]);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };
    const fetchReport = async () => {
        try {
            const response = await fetch('/api/employees/attendance-report', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(filters),
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report: ', error);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            Emp_ID: '',
            area_ID: '',
            status: '',
            clockType: ''
        });
        setReportData([]);
    };
    return(
        <>
            <div>
                <h2>Employee Attendance Report</h2>
                <div className="filter-controls">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                    <input type="text" name="Emp_ID" placeholder="Employee ID" value={filters.Emp_ID} onChange={handleChange} />
                    <select name="area_ID" value={filters.area_ID} onChange={handleChange}>
                        <option value="">-- Select Park Area --</option>
                        <option value="1">Magic Coogs</option>
                        <option value="2">Splash Central</option>
                        <option value="3">Highrise Coogs</option>
                        <option value="4">Lowball City</option>
                    </select>
                    <select name="status" value={filters.status} onChange={handleChange}>
                        <option value="">-- All Statuses --</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                    <select name="clockType" value={filters.clockType} onChange={handleChange}>
                        <option value="">-- Clock In & Out --</option>
                        <option value="clockin">Clock In Only</option>
                        <option value="clockout">Clock Out Only</option>
                    </select>
                </div>
                <button onClick={fetchReport}>Generate Report</button>
                <button onClick={clearFilters}>Clear</button>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Name</th>
                                <th>Area</th>
                                <th>Date</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                                <th>Hours Worked</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Emp_ID}</td>
                                        <td>{row.name}</td>
                                        <td>{row.area_name}</td>
                                        <td>{formatDate(row.day)}</td>
                                        <td>{row.clock_in || '-'}</td>
                                        <td>{row.clock_out || '-'}</td>
                                        <td>{row.hours_worked ?? '-'}</td>
                                        <td>{row.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No Results Found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <EmployeeHours />
            <EmployeeNumbers />
        </>
    );
};

export default AttendanceReport;