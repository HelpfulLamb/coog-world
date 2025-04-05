import React, {useState} from "react";
import './Modal.css';

function AddMaintenance({isOpen, onClose, onAddMaintenance}){
    const [newMaintenance, setNewMaintenance] = useState({
            Maintenance_Date: '',
            Maintenance_Cost: '',
            Maintenance_Type: '',
            Maintenance_Status: '',
            Maintenance_Object: '',
        });

        const [message, setMessage] = useState({error: '', success: ''});

        const handleInputChange = (e) => {
            const {name, value} = e.target;
            setNewMaintenance({...newMaintenance, [name]: value});
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if(!newMaintenance.Maintenance_Date || !newMaintenance.Maintenance_Cost || !newMaintenance.Maintenance_Type || 
                !newMaintenance.Maintenance_Status || !newMaintenance.Maintenance_Object){
                setMessage({error: 'All fields are required.', success: ''});
                return;
            }
            if(isNaN(newMaintenance.Maintenance_Cost)){
                setMessage({error: 'Must be a number.', success:''});
                return;
            }
            
            try {
                const response = await fetch('/api/maintenance/create-maintenance', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(newMaintenance),
                });
                const data = await response.json();
                console.log("Data: ", data);
                if(response.ok){
                    setMessage({success: 'Maintenance added succesfully!', error: ''});
                    setNewMaintenance({
                        Maintenance_Date: '',
                        Maintenance_Cost: '',
                        Maintenance_Type: '',
                        Maintenance_Status: '',
                        Maintenance_Object: '',
                    });
                    onAddMaintenance(data.maintenance);
                    setTimeout(() => {onClose(); window.location.href = window.location.href;});
                } else {
                    setMessage({error: data.message || 'Failed to add maintenance.', success: ''});
                }
            } catch (error) {
                setMessage({error: 'An error occurred. Please try again.', success: ''});
            }
        };

        if(!isOpen) return null;

        const getPlaceholders = (field) => {
            const placeholders = {
                'Maintenance_Date': 'e.g. 2025-04-04',
                'Maintenance_Cost': 'e.g. 12345',
            };
            return placeholders[field] || '';
        };

        return(
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Add New Maintenance</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-form-grid">
                            {['Maintenance_Date', 'Maintenance_Cost'].map((field) => (
                                <div className="modal-input-group" key={field}>
                                    <label htmlFor={field}>
                                        {field.replace(/_/g, ' ').replace(/([A_Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                    </label>
                                    <input 
                                    id={field}
                                    type={field === 'Maintenance_Date' ? 'date' : field === 'Maintenance_Cost' ? 'number' : 'text'}
                                    name={field}
                                    required
                                    autoComplete="off"
                                    value={newMaintenance[field]}
                                    onChange={handleInputChange}
                                    placeholder={getPlaceholders(field)}
                                    />
                                </div>
                            ))}
                            <div className="modal-input-group">
                                <label htmlFor="Maintenance_Type">Maintenance Type</label>
                                <select name="Maintenance_Type" id="Maintenance_Type" required value={newMaintenance.Maintenance_Type} onChange={handleInputChange}>
                                    <option value="">-- Select a Type --</option>
                                    <option value="1">Routine</option>
                                    <option value="2">Emergency</option>
                                </select>
                            </div>
                            <div className="modal-input-group">
                                <label htmlFor="Maintenance_Status">Status</label>
                                <select name="Maintenance_Status" id="Maintenance_Status" required value={newMaintenance.Maintenance_Status} onChange={handleInputChange}>
                                    <option value="">-- Select an Status --</option>
                                    <option value="1">In Progress</option>
                                    <option value="2">Completed</option>
                                    <option value="3">Pending</option>
                                </select>
                            </div>
                            <div className="modal-input-group">
                                <label htmlFor="Maintenance_Object">Status</label>
                                <select name="Maintenance_Object" id="Maintenance_Object" required value={newMaintenance.Maintenance_Object} onChange={handleInputChange}>
                                    <option value="">-- What needs maintenance? --</option>
                                    <option value="1">ride</option>
                                    <option value="2">stage</option>
                                    <option value="3">kiosk</option>
                                </select>
                            </div>
                        </div>
                        {message.error && <p className="error-message">{message.error}</p>}
                        {message.success && <p className="success-message">{message.success}</p>}
                        <div className="modal-buttons">
                            <button type="submit" className="button button-block">Report</button>
                            <button type="button" onClick={onClose} className="button button-block cancel-button">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
}
export default AddMaintenance;