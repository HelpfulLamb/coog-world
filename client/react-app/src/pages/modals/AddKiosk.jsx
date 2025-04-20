import { useState, useEffect } from "react";

export function UpdateKiosk({isOpen, onClose, kioskToEdit, onUpdateKiosk}){
    const [formData, setFormData] = useState({
        Kiosk_name: '',
        Kiosk_type: '',
        Kiosk_operate: '',
        Kiosk_loc: '',
        Staff_num: '',
        Kiosk_cost: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(kioskToEdit){
            setFormData({
                Kiosk_name: kioskToEdit.Kiosk_name || '',
                Kiosk_type: kioskToEdit.Kiosk_type || '',
                Kiosk_operate: kioskToEdit.Kiosk_operate ? 1 : 0,
                Kiosk_loc: kioskToEdit.Kiosk_loc || '',
                Staff_num: kioskToEdit.Staff_num || '',
                Kiosk_cost: kioskToEdit.Kiosk_cost || '',
            });
        }
    }, [kioskToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/kiosks/${kioskToEdit.Kiosk_ID}`,{
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Kiosk updated successfully!', error: ''});
                if(onUpdateKiosk){
                    onUpdateKiosk();
                    setMessage({success: 'Kiosk updated successfully!', error: ''});
                    setTimeout(() => {onClose();}, 1000);
                }
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the kiosk.', success: ''});
        }
    };
    if(!isOpen || !kioskToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Kiosk_name': 'e.g. Wands',
            'Kiosk_cost': 'e.g. 5000000',
            'Staff_num': 'e.g. 5'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Kiosk #{kioskToEdit.Kiosk_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['Kiosk_name', 'Kiosk_cost', 'Staff_num'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field === 'Staff_num' ? 'Employees' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Kiosk_cost' ? 'number' : field === 'Staff_num' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_type">Type</label>
                            <select name="Kiosk_type" id="Kiosk_type" required value={formData.Kiosk_type} onChange={handleInputChange}>
                                <option value="">-- Select a Type --</option>
                                <option value="Game">Game</option>
                                <option value="Food">Food</option>
                                <option value="Merch">Merch</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_loc">Location</label>
                            <select name="Kiosk_loc" id="Kiosk_loc" required value={formData.Kiosk_loc} onChange={handleInputChange}>
                                <option value="">-- Select a Location --</option>
                                <option value="1">Magic Coogs</option>
                                <option value="2">Splash Central</option>
                                <option value="3">Highrise Coogs</option>
                                <option value="4">Lowball City</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_operate">Status</label>
                            <select name="Kiosk_operate" id="Kiosk_operate" required value={formData.Kiosk_operate} onChange={handleInputChange}>
                                <option value="">-- Kiosk Status --</option>
                                <option value="0">Under Maintenance</option>
                                <option value="1">Operational</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Kiosk</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddKiosk({isOpen, onClose, onAddKiosk}){
    const [newKiosk, setNewKiosk] = useState({
        Kiosk_name: '',
        Kiosk_type: '',
        Kiosk_cost: '',
        Kiosk_loc: '',
        Staff_num: ''
    });

    const [message, setMessage] = useState({error: '', success: ''});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewKiosk({...newKiosk, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newKiosk.Kiosk_name || !newKiosk.Kiosk_type || !newKiosk.Kiosk_cost || !newKiosk.Kiosk_loc || !newKiosk.Staff_num){
            setMessage({error: 'All fields required.', success: ''});
            return;
        }
        if(isNaN(newKiosk.Staff_num)){
            setMessage({error: 'Number of staff working the kiosks OR cost of the kiosk(s) MUST be numbers.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/kiosks/create-kiosk', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newKiosk),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Kisk added successfully!', error: ''});
                setNewKiosk({
                    Kiosk_name: '',
                    Kiosk_type: '',
                    Kiosk_cost: '',
                    Kiosk_loc: '',
                    Staff_num: '',
                });
                onAddKiosk(data.kiosk);
                onClose();
            } else {
                setMessage({error: data.message || 'Failed to add kiosk.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Kiosk_name': 'e.g. Coog Shop',
            'Kiosk_cost': 'e.g. 500000',
            'Staff_num': 'e.g. 15',
            'Kiosk_type': 'Select the type of kiosk',
            'Kiosk_loc': 'Select the location of the kiosk'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Kiosk</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Kiosk_name', 'Kiosk_cost', 'Staff_num'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field === 'Staff_num' ? 'Employees' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Staff_num' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={newKiosk[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_type">Type of Kiosk</label>
                            <select name="Kiosk_type" id="Kiosk_type" required value={newKiosk.Kiosk_type} onChange={handleInputChange}>
                                <option value="">-- Select a Type --</option>
                                <option value="Food">Food</option>
                                <option value="Merch">Merchandise</option>
                                <option value="Game">Game Booth</option>
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_loc">Kiosk Located</label>
                            <select name="Kiosk_loc" id="Kiosk_loc" required value={newKiosk.Kiosk_loc} onChange={handleInputChange}>
                                <option value="">-- Select a Location --</option>
                                <option value='1'>Magic Coogs</option>
                                <option value='3'>Highrise Coogs</option>
                                <option value='2'>Splash Central</option>
                                <option value='4'>Lowball City</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Kiosk</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddKiosk;
