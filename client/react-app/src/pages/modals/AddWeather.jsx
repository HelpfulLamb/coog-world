import React, { useState } from "react";
import './Modal.css';

function AddWeather({ isOpen, onClose, onAddWeather }) {
    const [newWeather, setNewWeather] = useState({
        Wtr_cond: '',
        Wtr_level: '',
        Special_alerts: '',
        Is_park_closed: ''
    });
    const [message, setMessage] = useState({ error: '', success: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWeather({...newWeather, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newWeather.Wtr_cond || !newWeather.Wtr_level || !newWeather.Is_park_closed) {
            setMessage({ error: 'All fields are required.', success: '' });
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
            if (response.ok) {
                setMessage({ success: 'Weather added successfully!', error: '' });
                setNewWeather({
                    Wtr_cond: '',
                    Wtr_level: '',
                    Special_alerts: '',
                    Is_park_closed: '',
                });
                onAddWeather(data.weather);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({ error: data.message || 'Failed to add weather.', success: '' });
            }
        } catch (error) {
            setMessage({ error: 'An error occurred. Please try again.', success: '' });
        }
    };

    if (!isOpen) return null;

    const getPlaceholders = (field) => {
        const placeholders = {
            'Wtr_cond': 'e.g. Sunny',
            'Wtr_level': 'e.g. High',
            'Special_alerts': 'e.g. Flood Warning',
            'Is_park_closed': 'e.g. Yes or No'
        };
        return placeholders[field] || '';
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Weather</h2>
                <form onSubmit={handleSubmit}>
                    {['Special_alerts'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input
                                id={field}
                                type="text"
                                name={field}
                                required
                                autoComplete="off"
                                value={newWeather[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)}
                            />
                        </div>
                    ))}
                    <div className="modal-input-group">
                        <label htmlFor="Wtr_cond">Weather Condition</label>
                        <select name="Wtr_cond" id="Wtr_cond" required value={newWeather.Wtr_cond} onChange={handleInputChange}>
                            <option value="">-- Select Condition --</option>
                            <option value="Sunny">Sunny</option>
                            <option value="Windy">Windy</option>
                            <option value="Rain">Rain</option>
                            <option value="Stormy">Stormy</option>
                            <option value="Foggy">Foggy</option>
                            <option value="Hurricane">Hurricane</option>
                            <option value="Tornado">Tornado</option>
                        </select>
                    </div>
                    <div className="modal-input-group">
                        <label htmlFor="Wtr_level">Water Level</label>
                        <select name="Wtr_level" id="Wtr_level" required value={newWeather.Wtr_level} onChange={handleInputChange}>
                            <option value="">-- Select Level --</option>
                            <option value="Normal">Normal</option>
                            <option value="Severe">Severe</option>
                        </select>
                    </div>
                    <div className="modal-input-group">
                        <label htmlFor="Is_park_closed">Is Park Closed?</label>
                        <select name="Is_park_closed" id="Is_park_closed" required value={newWeather.Is_park_closed} onChange={handleInputChange}>
                            <option value="">-- Select Y or N --</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
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
