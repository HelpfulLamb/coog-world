import { useEffect, useState } from "react";

function AssignItem({isOpen, onClose, onAssignItem}){
    const [newAssignment, setNewAssignment] = useState({
        Kiosk_ID: '',
        Item_ID: '',
        Item_quantity: '',
        Restock_level: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const [items, setItems] = useState([]);
    const [kiosks, setKiosks] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemRes, kioskRes] = await Promise.all([fetch('/api/inventory/items'), fetch('/api/kiosks')]);
                const itemsData = await itemRes.json();
                const kiosksData = await kioskRes.json();
                setItems(itemsData);
                setKiosks(kiosksData);
            } catch (error) {
                setMessage({ error: 'Failed to load items or kiosks.', success: '' });
            }
        };
        if(isOpen) fetchData();
    }, [isOpen]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewAssignment({...newAssignment, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newAssignment.Kiosk_ID || !newAssignment.Item_ID || !newAssignment.Item_quantity || !newAssignment.Restock_level){
            setMessage({error: 'All fields are required!', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/inventory/create-assignment', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newAssignment),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Assignment created successfully.', error: ''});
                setNewAssignment({
                    Kiosk_ID: '',
                    Item_ID: '',
                    Item_quantity: '',
                    Restock_level: '',
                });
                onAssignItem(data.assign);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add assignment.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Kiosk_ID': 'e.g. 1',
            'Item_ID': 'e.g. 1',
            'Item_quantity': 'e.g. 100',
            'Restock_level': 'e.g. 20'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Assign New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Item_quantity', 'Restock_level'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Item_quantity' ? 'number' : field === 'Restock_level' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={newAssignment[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Item_ID">Item</label>
                            <select id='Item_ID' name="Item_ID" value={newAssignment.Item_ID} onChange={handleInputChange} required>
                                <option value="">-- Select an Item --</option>
                                {items.map(item => (
                                    <option key={item.Item_ID} value={item.Item_ID}>{item.Item_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-input-group">
                            <label htmlFor="Kiosk_ID">Kiosk</label>
                            <select id='Kiosk_ID' name="Kiosk_ID" value={newAssignment.Kiosk_ID} onChange={handleInputChange} required>
                                <option value="">-- Select a Kiosk --</option>
                                {kiosks.map(kiosk => (
                                    <option key={kiosk.Kiosk_ID} value={kiosk.Kiosk_ID}>{kiosk.Kiosk_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Assign Item</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignItem;