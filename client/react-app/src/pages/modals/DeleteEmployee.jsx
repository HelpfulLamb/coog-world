import { useState } from "react";
import './Modal.css';

function DeleteEmployee({ isOpen, onClose, onDeleteEmployee, employeeInformation }) {
    const [selectedId, setSelectedId] = useState("");
    const [message, setMessage] = useState({ error: "", success: "" });

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            
            console.log("About to delete Employee ID:", selectedId);
            console.log("Sending payload:", JSON.stringify({ Emp_ID: selectedId }));
            
            const response = await fetch(`/api/employees/delete-selected`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Emp_ID: selectedId }),  // Send ID to backend
            });

            const data = await response.json();
            console.log("Delete Response:", data);

            if (response.ok) {
                setMessage({ success: 'Employee deleted successfully!', error: '' });
                onDeleteEmployee(selectedId);
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1000);
            } else {
                setMessage({ error: data.message || 'Failed to delete employee.', success: '' });
            }
        } catch (error) {
            setMessage({ error: 'An error occurred. Please try again.', success: '' });
        }
    };

    if (!isOpen) return null;

    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Delete Employee</h2>
                <form onSubmit={handleDelete}>
                    <div className="modal-form-grid">
                        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
                            <option value="">Select Employee</option>
                            {employeeInformation.map((employee) => (
                                <option key={employee.Emp_ID} value={employee.Emp_ID}>
                                    {employee.First_name} {employee.Last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}

                    <div className="modal-buttons">
                        <button type="button" onClick={handleDelete} disabled={!selectedId} className="delete-button">Delete Employee</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteEmployee;