import { useState } from "react";

function AddBreakdown({isOpen, onClose, onAddBreakdown}){
    const [newBreakdown, setNewBreakdown] = useState({
        Maint_cost: '',
        Maint_Type: '',
        Maint_obj: '',
        Maintenance_Date: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewBreakdown({...newBreakdown, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newBreakdown.Maint_Type || !newBreakdown.Maint_cost || !newBreakdown.Maint_obj || !newBreakdown.Maintenance_Date){
            setMessage({error: 'All fields are required.', success: ''});
            return;
        }
        if(!isNaN(newBreakdown.Maint_cost)){
            setMessage({error: ' Maintenance cost MUST be a number.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/maintenance/create-breakdown', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newBreakdown),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'New maintenance log added successfully!', error: ''});
                setNewBreakdown({
                    Maint_cost: '',
                    Maint_obj: '',
                    Maint_Type: '',
                    Maintenance_Date: '',
                });
                onAddBreakdown(data.maintenance);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add breakdown.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Maint_Type': 'Select a maintenance type',
            'Maint_cost': 'e.g. 5000000',
            'Maint_obj': 'Select the object that needs maintenance',
            'Maintenance_Date': 'Select the date of maintenance'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Maintenance</h2>
                <form onSubmit={handleSubmit}>
                    {['Maint_Type', 'Maint_cost', 'Maint_obj', 'Maintenance_Date'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field}
                            type={field === 'Maint_cost' ? 'number' : field === 'Maintenance_Date' ? 'date' : 'text'}
                            name={field}
                            required
                            autoComplete="off"
                            value={newBreakdown[field]}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders(field)} />
                        </div>
                    ))}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit" className="button button-block">Add Maintenance</button>
                        <button type="button" onClick={onClose} className="button button-block cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBreakdown;