//This is used when adding rides to the database
import { useState, useEffect } from "react";

export function UpdateRide({isOpen, onClose, rideToEdit, onUpdateRide}){
    const [formData, setFormData] = useState({
        Ride_name: '',
        Ride_type: '',
        Ride_loc: '',
        Ride_cost: '',
        Ride_staff: '',
        Is_operate: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(rideToEdit){
            setFormData({
                Ride_name: rideToEdit.Ride_name || '',
                Ride_type: rideToEdit.Ride_type || '',
                Ride_loc: rideToEdit.Ride_loc || '',
                Ride_cost: rideToEdit.Ride_cost || '',
                Ride_staff: rideToEdit.Ride_staff || '',
                Is_operate: rideToEdit.Is_operate ? '1' : '0',
            });
        }
    }, [rideToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/rides/${rideToEdit.Ride_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Ride updated successfully!', error: ''});
                if(onUpdateRide) onUpdateRide({...data.ride, Ride_ID: rideToEdit.Ride_ID});
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the ride.', success: ''});
        }
    };
    if(!isOpen || !rideToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Ride_name': 'e.g. The Twister',
            'Ride_cost': 'e.g. 5000000',
            'Ride_staff': 'e.g. 5'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Ride #{rideToEdit.Ride_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
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
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Ride_type">Type</label>
                            <select name="Ride_type" id="Ride_type" required value={formData.Ride_type} onChange={handleInputChange}>
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
                        <div className="modal-input-group">
                            <label htmlFor="Ride_loc">Location</label>
                            <select name="Ride_loc" id="Ride_loc" required value={formData.Ride_loc} onChange={handleInputChange}>
                                <option value="">-- Select a Location --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Is_operate">Operating?</label>
                            <select name="Is_operate" value={formData.Is_operate} onChange={handleInputChange}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Ride</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddRide({isOpen, onClose, onAddRide}){
    const [newRide, setNewRide] = useState({
        Ride_name: '',
        Ride_type: '',
        Ride_loc: '',
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
        if(!newRide.Ride_name || !newRide.Ride_type || !newRide.Ride_loc || !newRide.Ride_cost || !newRide.Ride_staff){
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
            if(response.ok){
                setMessage({success: 'Ride added successfully!', error: ''});
                setNewRide({
                    Ride_name: '',
                    Ride_type: '',
                    Ride_loc: '',
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
                        <select id="Ride_type" name="Ride_type" required value={newRide.Ride_type} onChange={handleInputChange}>
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
                    <div className="modal-input-group">
                        <label htmlFor="Ride_loc">Location</label>
                        <select id="Ride_loc" name="Ride_loc" required value={newRide.Ride_loc} onChange={handleInputChange}>
                            <option value="">-- Select a Location --</option>
                            <option value="1">Magic Coogs</option>
                            <option value="2">Splash Central</option>
                            <option value="3">Highrise Coogs</option>
                            <option value="4">Lowball City</option>
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