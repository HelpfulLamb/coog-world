import { useEffect, useState } from "react";
import AddEmployee from "../modals/AddEmployee.jsx";
import DeleteEmployee from "../modals/DeleteEmployee.jsx"

function EmployeeTable({employeeInformation}){
    if (!employeeInformation || employeeInformation.length === 0) {
        return <div>No employee data available.</div>;
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
        </div>
    );
}

function Employee(){
    const [employeeInformation, setEmployeeInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //use active modal instead to switch button uses.
    const [activeModal, setActiveModal] = useState(null); 

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

    const handleAddEmployee = (newEmployee) => {
        setEmployeeInformation([...employeeInformation, newEmployee]);
    };

    const handleDeleteEmployee = (idToDelete) => {
        setEmployeeInformation(employeeInformation.filter(
            (employee) => employee.Emp_ID !== idToDelete
        ));
    };

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <div className="db-btn">
                <h1>Coog World Employees</h1>
                <div>
                    <button className="add-button" onClick={() => setActiveModal('add')}>Add Employee</button>
                    <button className="delete-button" onClick={() => setActiveModal('delete')}>Delete</button>
                </div>
            </div>
            <EmployeeTable employeeInformation={employeeInformation}/>
            {activeModal === 'add' && (
                <AddEmployee
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onAddEmployee={handleAddEmployee}
                />
            )}
      
            {activeModal === 'delete' && (
                <DeleteEmployee
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onDeleteEmployee={handleDeleteEmployee}
                    employeeInformation={employeeInformation}
                />
            )}
        </>
    );
}

export default Employee;