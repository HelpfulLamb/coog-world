import React, { useEffect, useState } from "react";
import './Modal.css';

export function UpdateWeather({isOpen, onClose, wtrToEdit, onUpdateWtr}){
    const [formData, setFormData] = useState({
        temperature: '',
        Wtr_cond: '',
        Wtr_level: '',
        Special_alerts: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(wtrToEdit){
            setFormData({
                temperature: wtrToEdit.temperature || '',
                Wtr_cond: wtrToEdit.Wtr_cond || '',
                Wtr_level: wtrToEdit.Wtr_level || '',
                Special_alerts: wtrToEdit.Special_alerts || '',
            });
        }
    }, [wtrToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/weather/${wtrToEdit.Wtr_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Weather log updated successfully!', error: ''});
                if(onUpdateWtr){
                    onUpdateWtr();
                    setMessage({success: 'Weather log updated successfully!', error: ''});
                    setTimeout(() => {onClose();}, 1000);
                }
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the weather log.', success: ''});
        }
    };
    if(!isOpen || !wtrToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'temperature': 'e.g. 75',
            'Special_alerts': 'e.g. Lightning in area'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Weather Log #{wtrToEdit.Wtr_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['temperature'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type="number"
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Wtr_cond">Condition:</label>
                            <select name="Wtr_cond" id="Wtr_cond" required value={formData.Wtr_cond} onChange={handleInputChange}>
                                <option value="">-- Select a Condition --</option>
                                <option value="Sunny">Sunny</option>
                                <option value="Windy">Windy</option>
                                <option value="Rain">Rain</option>
                                <option value="Stormy">Stormy</option>
                                <option value="Snow">Snow</option>
                                <option value="Foggy">Foggy</option>
                                <option value="Hurricane">Hurricane</option>
                                <option value="Tornado">Tornado</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Wtr_level">Water Level:</label>
                            <select name="Wtr_level" id="Wtr_level" required value={formData.Wtr_level} onChange={handleInputChange}>
                                <option value="">-- Water Level --</option>
                                <option value="Normal">Normal</option>
                                <option value="Severe">Severe</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Log</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddWeather({ isOpen, onClose, onAddWeather }) {
    const [newWeather, setNewWeather] = useState({
        temperature: '',
        Wtr_cond: '',
        Wtr_level: '',
        Special_alerts: ''
    });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [showSpecialAlerts, setShowSpecialAlerts] = useState(false); 

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewWeather({...newWeather, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newWeather.Special_alerts){
            newWeather.Special_alerts = 'No Special Alerts.';
        }
        if(!newWeather.Wtr_cond || !newWeather.Wtr_level || !newWeather.temperature){
            setMessage({error: 'Missing Fields', success: ''});
            return;
        }
        if(isNaN(newWeather.temperature)){
            setMessage({error: 'Temp must be a number.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/weather/create-weather', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newWeather),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'New weather has been logged.', error: ''});
                setNewWeather({
                    temperature: '',
                    Wtr_cond: '',
                    Wtr_level: '',
                    Special_alerts: '',
                });
                onAddWeather(data.weather);
                onClose();
            } else {
                setMessage({error: data.message || 'Failed to add new log.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if (!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'temperature': 'e.g. 75',
            'Special_alerts': 'e.g. Lightning in area'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Log New Weather</h2>
                <form onSubmit={handleSubmit}>
                    {['temperature'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field} 
                            type="number"
                            name={field}
                            required
                            autoComplete="off"
                            value={newWeather[field]}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders(field)} />
                        </div>
                    ))}
                    <div className="modal-input-group">
                        <label htmlFor="Wtr_cond">Condition:</label>
                        <select name="Wtr_cond" id="Wtr_cond" required value={newWeather.Wtr_cond} onChange={handleInputChange}>
                            <option value="">-- Select a Condition --</option>
                            <option value="Sunny">Sunny</option>
                            <option value="Windy">Windy</option>
                            <option value="Rain">Rain</option>
                            <option value="Stormy">Stormy</option>
                            <option value="Snow">Snow</option>
                            <option value="Foggy">Foggy</option>
                            <option value="Hurricane">Hurricane</option>
                            <option value="Tornado">Tornado</option>
                        </select>
                    </div>
                    <div className="modal-input-group">
                        <label htmlFor="Wtr_level">Water Level:</label>
                        <select name="Wtr_level" id="Wtr_level" required value={newWeather.Wtr_level} onChange={handleInputChange}>
                            <option value="">-- Water Level --</option>
                            <option value="Normal">Normal</option>
                            <option value="Severe">Severe</option>
                        </select>
                    </div>
                    <div className="modal-input-group" style={{ marginBottom: '10px' }}>
                        <button type="button" className="toggle-button"
                            onClick={() => {
                                
                                if (!showSpecialAlerts) {
                                    setNewWeather({ ...newWeather, Special_alerts: '' });
                                }
                                setShowSpecialAlerts(!showSpecialAlerts);
                            }}>
                            {showSpecialAlerts ? "Remove Special Alert" : "Add Special Alert"}
                        </button>
                    </div>
                    {showSpecialAlerts && (
                        <div className="modal-input-group">
                            <label htmlFor="Special_alerts">Special Alerts</label>
                            <input
                            id="Special_alerts"
                            type="text"
                            name="Special_alerts"
                            autoComplete="off"
                            value={newWeather.Special_alerts}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders("Special_alerts")} />
                        </div>
                    )}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Weather</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddWeather;
