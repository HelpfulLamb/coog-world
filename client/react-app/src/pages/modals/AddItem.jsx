import { useState, useEffect } from "react";

export function UpdateItem({isOpen, onClose, itemToEdit, onUpdateItem}){
    const [formData, setFormData] = useState({
        Item_type: '',
        Item_name: '',
        Item_desc: '',
        Item_shop_price: '',
        Item_unit_price: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(itemToEdit){
            setFormData({
                Item_type: itemToEdit.Item_type || '',
                Item_name: itemToEdit.Item_name || '',
                Item_desc: itemToEdit.Item_desc || '',
                Item_shop_price: itemToEdit.Item_shop_price || '',
                Item_supply_price: itemToEdit.Item_supply_price || '',
            });
        }
    }, [itemToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/inventory/items/${itemToEdit.Item_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Ride updated successfully!', error: ''});
                if(onUpdateItem) onUpdateItem({...data.item, Item_ID: itemToEdit.Item_ID});
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the item.', success: ''});
        }
    };
    if(!isOpen || !itemToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Item_name': 'e.g. Plush',
            'Item_desc': 'e.g. Red Shirt',
            'Item_shop_price': 'e.g. 50.00',
            'Item_supply_price': 'e.g. 1.50'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Item #{itemToEdit.Item_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['Item_name', 'Item_desc', 'Item_shop_price', 'Item_supply_price'].map((field) => (
                            <div className="modal-input-group">
                                <label htmlFor={field}>
                                    {field === 'Item_shop_price' ? 'Sell Price' : field === 'Item_supply_price' ? 'Unit Price' : field === 'Item_desc' ? 'Description' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Item_shop_price' ? 'number' : field === 'Item_supply_price' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Item_type">Type</label>
                            <select name="Item_type" id="Item_type" required value={formData.Item_type} onChange={handleInputChange}>
                                <option value="">-- Select a Type --</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Toy">Toy</option>
                                <option value="Souvenirs">Souvenirs</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Food">Food</option>
                                <option value="Drink">Drink</option>
                                <option value="Collectible">Collectible</option>
                                <option value="Prize">Prize</option>
                                <option value="Seasonal">Seasonal</option>
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Item</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function UpdateAssignment({isOpen, onClose, assignmentToEdit, onUpdateAssignment}){
    return(
        <div></div>
    );
}

export function AssignItem({isOpen, onClose, onAssignItem}){
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

function AddItem({isOpen, onClose, onAddItem}){
    const [newItem, setNewItem] = useState({
        Item_type: '',
        Item_name: '',
        Item_desc: '',
        Item_shop_price: '',
        Item_supply_price: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewItem({...newItem, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newItem.Item_desc || !newItem.Item_name || !newItem.Item_type || !newItem.Item_shop_price){
            setMessage({error: 'All fields are required!', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/inventory/create-item', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Item added successfully.', error: ''});
                setNewItem({
                    Item_type: '',
                    Item_name: '',
                    Item_desc: '',
                    Item_shop_price: '',
                    Item_supply_price: ''
                });
                onAddItem(data.item);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add item.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Item_name': 'e.g. Coog World Shirt',
            'Item_type': 'e.g. Shirt',
            'Item_desc': 'e.g. Small Red Shirt',
            'Item_shop_price': 'e.g. 25.00',
            'Item_supply_price': 'e.g. 1.25'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Item_name', 'Item_desc', 'Item_shop_price', 'Item_supply_price'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field === 'Item_desc' ? 'Description' : field === 'Item_supply_price' ? 'Unit Price' : field === 'Item_shop_price' ? 'Selling Price' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Item_shop_price' ? 'number' : field === 'Item_supply_price' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={newItem[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                        <label htmlFor="Item_type">Item Type</label>
                        <select
                            id="Item_type"
                            name="Item_type"
                            required
                            value={newItem.Item_type}
                            onChange={handleInputChange}>
                            <option value="">-- Select a type --</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Toy">Toy</option>
                            <option value="Souvenirs">Souvenirs</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Food">Food</option>
                            <option value="Drink">Drink</option>
                            <option value="Collectible">Collectible</option>
                            <option value="Prize">Prize</option>
                            <option value="Seasonal">Seasonal</option>
                        </select>
                    </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Item</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItem;