import React, {useState, useEffect} from "react";
import Select from 'react-select';
import './Modal.css';

function AddMaintenance({isOpen, onClose, onAddMaintenance}){
    const [newMaintenance, setNewMaintenance] = useState({
            Maintenance_Date: '',
            Maintenance_Cost: '',
            Maintenance_Type: '',
            Maintenance_Status: '',
            Maintenance_Object: '',
            Maintenance_Object_ID: '',
        });

        const [message, setMessage] = useState({error: '', success: ''});
        const [objectsList, setObjectsList] = useState([]);
        const [selectedObjectType, setSelectedObjectType] = useState('');

        useEffect(() => {
            const fetchObjects = async (objectType) => {
                try {
                    const response = await fetch(`/api/maintenance/objects/${objectType}`);
                    const data = await response.json();
        
                    if (objectType === 'ride') {
                        setObjectsList(data.map(item => ({
                            value: item.Ride_ID, 
                            label: item.Ride_name, 
                            type: 'ride' 
                        })));
                    } else if (objectType === 'stage') {
                        setObjectsList(data.map(item => ({
                            value: item.Stage_ID,
                            label: item.Stage_name,
                            type: 'stage'
                        })));
                    } else if (objectType === 'kiosk') {
                        setObjectsList(data.map(item => ({
                            value: item.Kiosk_ID,
                            label: item.Kiosk_name,
                            type: 'kiosk'
                        })));
                    }
                } catch (error) {
                    console.error('Error fetching objects:', error);
                    setObjectsList([]);
                }
            };
        
            if (selectedObjectType) {
                fetchObjects(selectedObjectType);
            }
        }, [selectedObjectType]);

        const handleInputChange = (e) => {
            const {name, value} = e.target;
            setNewMaintenance({...newMaintenance, [name]: value});
        };

        const handleObjectChange = (selectedOption) => {
            setNewMaintenance({
                ...newMaintenance,
                Maintenance_Object: selectedOption.type,
                Maintenance_Object_ID: selectedOption.value
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if(!newMaintenance.Maintenance_Date || !newMaintenance.Maintenance_Cost || !newMaintenance.Maintenance_Type || 
                !newMaintenance.Maintenance_Status || !newMaintenance.Maintenance_Object || !newMaintenance.Maintenance_Object_ID){
                setMessage({error: 'All fields are required.', success: ''});
                return;
            }
            if(isNaN(newMaintenance.Maintenance_Cost)){
                setMessage({error: 'Cost must be a valid number.', success:''});
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
                        Maintenance_Object_ID: '',
                    });
                    onAddMaintenance(data.maintenance);
                    setTimeout(() => { onClose(); window.location.reload(); }); //setTimeout(() => {onClose(); window.location.href = window.location.href;});
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
                                <label htmlFor="Maintenance_Object">What needs maintenance?</label>
                                <select
                                    name="Maintenance_Object"
                                    id="Maintenance_Object"
                                    required
                                    value={selectedObjectType}
                                    onChange={(e) => setSelectedObjectType(e.target.value)}
                                >
                                    <option value="">-- Select Object Type --</option>
                                    <option value="ride">Ride</option>
                                    <option value="stage">Stage</option>
                                    <option value="kiosk">Kiosk</option>
                                </select>
                            </div>
                            {selectedObjectType && objectsList.length > 0 && (
                                <div className="modal-input-group">
                                    <label htmlFor="Object_Name">Select Object</label>
                                    <Select
                                        options={objectsList}
                                        onChange={handleObjectChange}
                                        placeholder="Search and select..."
                                    />
                                </div>
                            )}
                            {objectsList.length === 0 && selectedObjectType && <p>No objects found for this type.</p>} {/* Display error if no objects are found */}
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