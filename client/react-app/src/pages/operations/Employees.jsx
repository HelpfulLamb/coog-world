import { useEffect, useState } from "react";
import AddEmployee, {UpdateEmployee} from "../modals/AddEmployee.jsx";

function EmployeeTable({employeeInformation, setIsModalOpen, onEditEmp, onDeleteEmp}){
    if (!employeeInformation || !Array.isArray(employeeInformation)) {
        return <div>No employee data is currently available.</div>;
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Email</th>
                        <th>Sector</th>
                        <th>Occupation</th>
                        <th>Salary</th>
                        <th>Start Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employeeInformation.map((employee) => (
                        <tr key={employee.Emp_ID}>
                            <td>{employee.Last_name}</td>
                            <td>{employee.First_name}</td>
                            <td>{employee.Emp_email}</td>
                            <td>{employee.area_name}</td>
                            <td>{employee.Occ_name}</td>
                            <td>${Number(employee.Emp_salary).toLocaleString()}</td>
                            <td>{formatDate(employee.Start_date)}</td>
                            <td>
                                <button onClick={() => onEditEmp(employee)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteEmp(employee.Emp_ID)} className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Employee(){
    const [employeeInformation, setEmployeeInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);

    const [filteredEmps, setFilteredEmps] = useState([]);
    const [empFirstNameFilter, setEmpFirstNameFilter] = useState('');
    const [empLastNameFilter, setEmpLastNameFilter] = useState('');
    const [empLocationFilter, setEmpLocationFilter] = useState('');
    const [empOccFilter, setEmpOccFilter] = useState('');
    const [salaryRangeFilter, setSalaryRangeFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/api/employees/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setEmployeeInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        let filtered = [...employeeInformation];
        const toDateOnly = (date) => {
            return new Date(date).toISOString().split('T')[0];
        };
        if(empFirstNameFilter){
            filtered = filtered.filter(emp => emp.First_name.toLowerCase().includes(empFirstNameFilter.toLowerCase()));
        }
        if(empLastNameFilter){
            filtered = filtered.filter(emp => emp.Last_name.toLowerCase().includes(empLastNameFilter.toLowerCase()));
        }
        if(empLocationFilter){
            filtered = filtered.filter(emp => emp.area_name.toLowerCase().includes(empLocationFilter.toLowerCase()));
        }
        if(empOccFilter){
            filtered = filtered.filter(emp => emp.Occ_name.toLowerCase().includes(empOccFilter.toLowerCase()));
        }
        if(salaryRangeFilter){
            const [min, max] = salaryRangeFilter.split('-').map(Number);
            filtered = filtered.filter(emp => {
                const salary = Number(emp.Emp_salary);
                return salary >= min && (isNaN(max) || salary <= max);
            });
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'nameAsc':
                    return a.Last_name.localeCompare(b.Last_name);
                case 'nameDesc':
                    return b.Last_name.localeCompare(a.Last_name);
                case 'salaryAsc':
                    return a.Emp_salary - b.Emp_salary;
                case 'salaryDesc':
                    return b.Emp_salary - a.Emp_salary;            
                default:
                    return 0;
            }
        });
        setFilteredEmps(filtered);
    }, [employeeInformation, empFirstNameFilter, empLastNameFilter, empLocationFilter, empOccFilter, salaryRangeFilter, sortOption]);

    const handleAddEmployee = (newEmployee) => {
        setEmployeeInformation([...employeeInformation, newEmployee]);
    };
    const handleEditEmp = (employee) => {
        setSelectedEmp(employee);
        setIsEditOpen(true);
    };
    const handleUpdateEmp = (updatedEmp) => {
        setEmployeeInformation(prev => prev.map(employee => employee.Emp_ID === updatedEmp.Emp_ID ? UpdateEmployee : employee));
    };
    const handleDelete = async (empID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this employee? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/employees/delete-selected',{
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Emp_ID: empID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Employee deleted successfully!');
                setEmployeeInformation(prev => prev.filter(emp => emp.Emp_ID !== empID));
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to delete employee.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    const resetFilters = () => {
        setEmpFirstNameFilter('');
        setEmpLastNameFilter('');
        setEmpLocationFilter('');
        setEmpOccFilter('');
        setSalaryRangeFilter('');
        setSortOption('');
    };

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <EmployeeNumbers />
            <div className="filter-controls">
                <h2>Filter Employees</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="empFname">Emp First Name:</label>
                        <input type="text" id="empFname" value={empFirstNameFilter} onChange={(e) => setEmpFirstNameFilter(e.target.value)} placeholder="Filter by first name" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="empLname">Emp Last Name:</label>
                        <input type="text" id="empLname" value={empLastNameFilter} onChange={(e) => setEmpLastNameFilter(e.target.value)} placeholder="Filter by last name" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="empOcc">Occupation:</label>
                        <select id="empOcc" value={empOccFilter} onChange={(e) => setEmpOccFilter(e.target.value)}>
                            <option value="">-- Select an Occupation --</option>
                            <option value="Ride Operator">Ride Operator</option>
                            <option value="Game Attendant">Game Attendant</option>
                            <option value="Retail Staff">Retail Staff</option>
                            <option value="Stage Staff">Stage Staff</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Security">Security</option>
                            <option value="Manager">Manager</option>
                            <option value="IT">IT</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="empSec">Location:</label>
                        <select id="empSec" value={empLocationFilter} onChange={(e) => setEmpLocationFilter(e.target.value)}>
                            <option value="">-- Select a Location --</option>
                            <option value="Magic Coogs">Magic Coogs</option>
                            <option value="Highrise Coogs">Highrise Coogs</option>
                            <option value="Splash Central">Splash Central</option>
                            <option value="Lowball City">Lowball City</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="salaryRange">Salary Range:</label>
                        <select id="salaryRange" value={salaryRangeFilter} onChange={(e) => setSalaryRangeFilter(e.target.value)}>
                            <option value="">-- Select a Salary Range --</option>
                            <option value="35000-64999">$35,000 - $64,999</option>
                            <option value="65000-94999">$65,000 - $94,999</option>
                            <option value="95000-124999">$95,000 - $124,999</option>
                            <option value="125000-249999">$125,000 - $249,999</option>
                            <option value="250000-999999999">$250,000+</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Sort Method --</option>
                            <option value="nameAsc">Last Name (A-Z)</option>
                            <option value="nameDesc">Last Name (Z-A)</option>
                            <option value="salaryAsc">Salary (Low to High)</option>
                            <option value="salaryDesc">Salary (High to Low)</option>
                        </select>
                    </div>
                </div>
                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Coog World Employees</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Employee</button>
                </div>
            </div>

            <EmployeeTable employeeInformation={filteredEmps} setIsModalOpen={setIsModalOpen} onEditEmp={handleEditEmp} onDeleteEmp={handleDelete} />
            <AddEmployee isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEmployee={handleAddEmployee} />
            <UpdateEmployee isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedEmp(null);}} empToEdit={selectedEmp} onUpdateEmp={handleUpdateEmp} />
        </>
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

export default Employee;