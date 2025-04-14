import React, { useState, useEffect } from 'react';
import './Modal.css';

export function UpdateStage({ isOpen, onClose, stageToEdit, onUpdateStage }) {
    const [formData, setFormData] = useState({
        Stage_name: '',
        area_ID: '',
        Stage_maint: '',
        Staff_num: '',
        Seat_num: '',
        Is_operate: ''
    });

    const [message, setMessage] = useState({ error: '', success: '' });

    
    useEffect(() => {
        if (stageToEdit) {
            setFormData({
                Stage_name: stageToEdit.Stage_name || '',
                area_ID: stageToEdit.area_ID?.toString() || '',
                Stage_maint: stageToEdit.Stage_maint?.split('T')[0] || '',
                Staff_num: stageToEdit.Staff_num?.toString() || '',
                Seat_num: stageToEdit.Seat_num?.toString() || '',
                Is_operate: stageToEdit.Is_operate?.toString() || '0',
            });
        }
    }, [stageToEdit]);

    
    const getUserId = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return parsedUser?.id || parsedUser?.Emp_ID;
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = getUserId();
        if (!userId) {
            setMessage({ error: 'User is not logged in. Please log in to update the stage.', success: '' });
            return;
        }

        const payload = {
            Stage_name: formData.Stage_name,
            area_ID: formData.area_ID,
            Stage_maint: formData.Stage_maint,
            Staff_num: formData.Staff_num,
            Seat_num: formData.Seat_num,
            Is_operate: formData.Is_operate,
            Stage_updated_by: userId,
        };

        try {
            const response = await fetch(`/api/stages/update/${stageToEdit.Stage_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ success: 'Stage updated successfully!', error: '' });
                setTimeout(() => {
                    onUpdateStage(data.stage); 
                    onClose(); 
                }, 1500);
            } else {
                setMessage({ error: data.message || 'Failed to update stage.', success: '' });
            }
        } catch (err) {
            setMessage({ error: 'An error occurred while updating stage.', success: '' });
        }
    };

    if (!isOpen || !stageToEdit) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Stage #{stageToEdit.Stage_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Stage_name', 'Stage_maint', 'Staff_num', 'Seat_num'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
                                <input
                                    id={field}
                                    type={field === 'Stage_maint' ? 'date' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="area_ID">Location</label>
                            <select name="area_ID" value={formData.area_ID} onChange={handleChange} required>
                                <option value="">-- Select Area --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Is_operate">Operating?</label>
                            <select name="Is_operate" value={formData.Is_operate} onChange={handleChange}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Stage</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function AddStage({ isOpen, onClose, onAddStage }) {
    const [newStage, setNewStage] = useState({
        Stage_name: '',
        area_ID: '',
        Stage_maint: new Date().toISOString().split('T')[0], 
        Staff_num: '',
        Seat_num: '',
        Is_operate: '1'
    });

    const [message, setMessage] = useState({ success: '', error: '' });

    
    const getUserId = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return parsedUser?.id || parsedUser?.Emp_ID;
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStage({ ...newStage, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Form submission started");
    
        const userId = getUserId();
        if (!userId) {
            setMessage({ error: 'User is not logged in. Please log in to add a stage.', success: '' });
            return;
        }
    
        const payload = {
            Stage_name: newStage.Stage_name,
            area_ID: parseInt(newStage.area_ID, 10),
            Stage_maint: newStage.Stage_maint,
            Staff_num: parseInt(newStage.Staff_num, 10),
            Seat_num: parseInt(newStage.Seat_num, 10),
            Is_operate: parseInt(newStage.Is_operate, 10),
            Stage_created_by: userId,
        };
    
        if (!payload.Stage_name || !payload.area_ID || !payload.Stage_maint || !payload.Staff_num || !payload.Seat_num) {
            setMessage({ error: 'All fields are required.', success: '' });
            return;
        }
    
        try {
            console.log("Sending the API request...");
            const response = await fetch('/api/stages/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log("API response received:", data);
    
            if (response.ok && data.Stage_ID) {  
                setMessage({ success: data.message || 'Stage added successfully!', error: '' });
    
                setNewStage({
                    Stage_name: '',
                    area_ID: '',
                    Stage_maint: new Date().toISOString().split('T')[0],
                    Staff_num: '',
                    Seat_num: '',
                    Is_operate: '1',
                });
    
                
                const updatedStage = { ...payload, Stage_ID: data.Stage_ID };
                onAddStage(updatedStage);  
    
                
                setTimeout(() => {
                    console.log("Refreshing the page...");
                    window.location.reload(); 
                }, 1500);
            } else {
                setMessage({ error: data.message || 'Failed to add stage.', success: '' });
            }
        } catch (err) {
            console.error("Error during API call:", err);
            setMessage({ error: 'An error occurred while adding the stage.', success: '' });
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Stage</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Stage_name', 'Stage_maint', 'Staff_num', 'Seat_num'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
                                <input
                                    id={field}
                                    type={field === 'Stage_maint' ? 'date' : 'text'}
                                    name={field}
                                    value={newStage[field]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="area_ID">Location</label>
                            <select name="area_ID" value={newStage.area_ID} onChange={handleChange} required>
                                <option value="">-- Select Area --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Is_operate">Operating?</label>
                            <select name="Is_operate" value={newStage.Is_operate} onChange={handleChange}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    {message.error && !message.success && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Stage</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default { AddStage, UpdateStage };
