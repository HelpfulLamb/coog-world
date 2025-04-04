//This is used when adding rides to the database
import { useState } from "react";

function AddRide({isOpen, onClose, onAddRide}){
    const [newRide, setNewRide] = useState({
        Ride_name: '',
        Ride_type: '',
        Ride_cost: '',
        Ride_staff: ''
    });

    const [message, setMessage] = useState({error: '', success: ''});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewRide({...newRide, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting ride data: ', newRide);
        if(!newRide.Ride_name || !newRide.Ride_type || !newRide.Ride_cost || !newRide.Ride_staff){
            setMessage({error: 'All fields are required.', success: ''});
            return;
        }
        if(isNaN(newRide.Ride_staff)){
            setMessage({error: 'Number of Staff operating rides OR the cost of the ride MUST be numbers.', success: ''});
            return;
        }

        try {
            const response = await fetch('/api/rides/create-ride', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newRide),
            });
            const data = await response.json();
            console.log('Backend repsonse: ', data);
            if(response.ok){
                setMessage({success: 'Ride added successfully!', error: ''});
                setNewRide({
                    Ride_name: '',
                    Ride_type: '',
                    Ride_cost: '',
                    Ride_staff: '',
                });
                onAddRide(data.ride);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add ride.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;

    const getPlaceholders = (field) => {
        const placeholders = {
            'Ride_name': 'e.g. The Twister',
            'Ride_cost': 'e.g. 5000000',
            'Ride_staff': 'e.g. 5',
            'Ride_type': 'Select the type of ride'
        };
        return placeholders[field] || '';
    };

    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Ride</h2>
                <form onSubmit={handleSubmit}>
                    {['Ride_name', 'Ride_cost', 'Ride_staff'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field === 'Ride_staff' ? 'Operators' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field}
                            type={field === 'Ride_cost' ? 'number' : field === 'Ride_staff' ? 'number' : 'text'}
                            name={field}
                            required
                            autoComplete="off"
                            value={newRide[field]}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders(field)} />
                        </div>
                    ))}
                    {/* Dropdown for Ride_type */}
                    <div className="modal-input-group">
                        <label htmlFor="Ride_type">Type of Ride</label>
                        <select
                            id="Ride_type"
                            name="Ride_type"
                            required
                            value={newRide.Ride_type}
                            onChange={handleInputChange}>
                            <option value="">-- Select a type --</option>
                            <option value="Normal">Normal</option>
                            <option value="Water">Water</option>
                            <option value="Thrill">Thrill</option>
                            <option value="Family">Family</option>
                            <option value="Spinning">Spinning</option>
                            <option value="Water Coaster">Water Coaster</option>
                            <option value="Extreme">Extreme</option>
                        </select>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Ride</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRide;