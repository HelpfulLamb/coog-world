import { useState } from "react";

function AddWeather({isOpen, onClose, onAddWeather}){
    const [newWeather, setNewWeather] = useState({
        Wtr_cond: '',
        Wtr_level: '',
        Special_alerts: '',
        Is_parked_closed: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewWeather({...newWeather, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newWeather.Wtr_cond || !newWeather.Wtr_level || !newWeather.Special_alerts || !newWeather.Is_parked_closed){
            setMessage({error: 'All fields are required.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/weather/create-weather', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newRide),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Weather added successfully!', error: ''});
                setNewRide({
                    Wtr_cond: '',
                    Wtr_level: '',
                    Special_alerts: '',
                    Is_parked_closed: '',
                });
                onAddWeather(data.weather);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add weather.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Wtr_cond': 'e.g. Sunny',
            'Wtr_level': 'e.g. High',
            'Special_alerts': 'e.g. Flood Warning',
            'Is_park_closed': 'e.g. yes, no'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Weather</h2>
                <form onSubmit={handleSubmit}>
                    {['Wtr_cond', 'Wtr_level', 'Special_alerts', 'Is_park_closed'].map((field) => (
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
                            placeholder={getPlaceholders(field)} />
                        </div>
                    ))}
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