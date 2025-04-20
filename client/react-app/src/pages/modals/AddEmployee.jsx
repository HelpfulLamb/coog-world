import React, {useState, useEffect} from "react";
import './Modal.css';

export function UpdateEmployee({isOpen, onClose, empToEdit, onUpdateEmp}){
    const [formData, setFormData] = useState({
        First_name: '',
        Last_name: '',
        Emp_phone: '',
        Emp_email: '',
        Emp_sec: '',
        Emp_pos: '',
        Emp_salary: '',
        End_date: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(empToEdit){
            setFormData({
                First_name: empToEdit.First_name || '',
                Last_name: empToEdit.Last_name || '',
                Emp_phone: empToEdit.Emp_phone || '',
                Emp_email: empToEdit.Emp_email || '',
                Emp_sec: empToEdit.Emp_sec || '',
                Emp_pos: empToEdit.Emp_pos || '',
                Emp_salary: empToEdit.Emp_salary || '',
                End_date: empToEdit.End_date?.split('T')[0] || '',
            });
        }
    }, [empToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/employees/${empToEdit.Emp_ID}`,{
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Employee updated successfully!', error: ''});
                if(onUpdateEmp) onUpdateEmp({...data.emp, Emp_ID: empToEdit.Emp_ID});
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating employee.', success: ''});
        }
    };
    if(!isOpen || !empToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'First_name': 'e.g. John',
            'Last_name': 'e.g. Smith',
            'Emp_phone': 'e.g. 555-123-4567',
            'Emp_email': 'e.g. john.smith@example.com',
            'Emp_salary': 'e.g. 50000'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Employee #{empToEdit.Emp_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['First_name', 'Last_name', 'Emp_phone', 'Emp_email','Emp_salary', 'End_date'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
                                <input 
                                id={field}
                                type={field === 'End_date' ? 'date' : field === 'Emp_salary' ? 'number' : field === 'Emp_email' ? 'email' : field === 'Emp_phone' ? 'tel' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Emp_sec">Location</label>
                            <select name="Emp_sec" id="Emp_sec" required value={formData.Emp_sec} onChange={handleInputChange}>
                                <option value="">-- Select a Location --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Emp_pos">Occupation</label>
                            <select name="Emp_pos" id="Emp_pos" required value={formData.Emp_pos} onChange={handleInputChange}>
                                <option value="">-- Select an Occupation --</option>
                                <option value="1">Ride Operator</option>
                                <option value="3">Retail Staff</option>
                                <option value="5">Game Attendant</option>
                                <option value="8">Stage Staff</option>
                                <option value="7">Manager</option>
                                <option value="4">Maintenance</option>
                                <option value="6">Security</option>
                                <option value="2">IT</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Employee</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddEmployee({isOpen, onClose, onAddEmployee}){
    const [newEmployee, setNewEmployee] = useState({
        First_name: '',
        Last_name: '',
        Emp_phone: '',
        Emp_email: '',
        Emp_password: '',
        Emp_sec: '',
        Emp_pos: '',
        Emp_salary: '',
        Start_date: '',
    });

    const [message, setMessage] = useState({error: '', success: ''});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewEmployee({...newEmployee, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!newEmployee.First_name || !newEmployee.Last_name || !newEmployee.Emp_phone || !newEmployee.Emp_email || !newEmployee.Emp_password || !newEmployee.Emp_sec || !newEmployee.Emp_pos || !newEmployee.Emp_salary || !newEmployee.Start_date){
            setMessage({error: 'All fields are required.', success: ''});
            return;
        }
        if(isNaN(newEmployee.Emp_salary)){
            setMessage({error: 'Salary must be a number.', success:''});
            return;
        }
        try {
            const response = await fetch('/api/employees/create-employee', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Employee added succesfully!', error: ''});
                setNewEmployee({
                    First_name: '',
                    Last_name: '',
                    Emp_phone: '',
                    Emp_email: '',
                    Emp_password: '',
                    Emp_sec: '',
                    Emp_pos: '',
                    Emp_salary: '',
                    Start_date: '',
                });
                onAddEmployee(data.employee);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add employee.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };

    if(!isOpen) return null;

    const getPlaceholders = (field) => {
        const placeholders = {
            'First_name': 'e.g. John',
            'Last_name': 'e.g. Smith',
            'Emp_phone': 'e.g. 555-123-4567',
            'Emp_email': 'e.g. john.smith@example.com',
            'Emp_password': 'Minimum 12 characters',
            'Emp_salary': 'e.g. 50000',
            'Start_date': 'Select a start date'
        };
        return placeholders[field] || '';
    };

    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['First_name', 'Last_name', 'Emp_phone', 'Emp_email', 'Emp_password', 'Emp_salary', 'Start_date'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Emp_salary' ? 'number' : field === 'Start_date' ? 'date' : field === 'Emp_email' ? 'email' : field === 'Emp_phone' ? 'tel' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={newEmployee[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)}
                                min={field === 'Start_date' ? new Date().toISOString().split('T')[0] : undefined} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Emp_sec">Work Location</label>
                            <select name="Emp_sec" id="Emp_sec" required value={newEmployee.Emp_sec} onChange={handleInputChange}>
                                <option value="">-- Select a Location --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Emp_pos">Occupation</label>
                            <select name="Emp_pos" id="Emp_pos" required value={newEmployee.Emp_pos} onChange={handleInputChange}>
                                <option value="">-- Select an Occupation --</option>
                                <option value="1">Ride Operator</option>
                                <option value="3">Retail Staff</option>
                                <option value="5">Game Attendant</option>
                                <option value="8">Stage Staff</option>
                                <option value="7">Manager</option>
                                <option value="4">Maintenance</option>
                                <option value="6">Security</option>
                                <option value="2">IT</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Employee</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
