import { useEffect, useState } from "react";
import AddEmployee from "../modals/AddEmployee.jsx";
import './Employee.css';

function EmployeeTable({employeeInformation, setIsModalOpen}){
    if (!employeeInformation || !Array.isArray(employeeInformation)) {
        return <div>No employee data available.</div>;
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="employee-table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Sector</th>
                        <th>Occupation</th>
                        <th>Salary</th>
                        <th>Start Date</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeInformation.map((employee) => (
                        <tr key={employee.Emp_ID}>
                            <td>{employee.Emp_ID}</td>
                            <td>{employee.First_name}</td>
                            <td>{employee.Last_name}</td>
                            <td>{employee.Emp_email}</td>
                            <td>{employee.area_name}</td>
                            <td>{employee.Occ_name}</td>
                            <td>${Number(employee.Emp_salary).toLocaleString()}</td>
                            <td>{formatDate(employee.Start_date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button className="add-employee-button" onClick={() => setIsModalOpen(true)}>Add Employee</button>
            </div>
        </div>
    );
}

function Employee(){
    const [employeeInformation, setEmployeeInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:3305/api/employees/info');
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

    const handleAddEmployee = (newEmployee) => {
        setEmployeeInformation([...employeeInformation, newEmployee]);
    };

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Coog World Employees</h1>
            <EmployeeTable employeeInformation={employeeInformation} setIsModalOpen={setIsModalOpen} />
            <AddEmployee isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEmployee={handleAddEmployee} />
        </>
    );
}

export default Employee;