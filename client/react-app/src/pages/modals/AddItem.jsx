import { useState } from "react";

function AddItem({isOpen, onClose, onAddItem}){
    const [newItem, setNewItem] = useState({
        Item_type: '',
        Item_name: '',
        Item_desc: '',
        Item_shop_price: '',
        Item_supply_price: '',
        Item_quantity: '',
        Kiosk_ID: '',
        Restock_level: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewItem({...newItem, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newItem.Item_desc || !newItem.Item_name || !newItem.Item_type || !newItem.Item_shop_price || !newItem.Item_supply_price || !newItem.Kiosk_ID || !newItem.Restock_level || !newItem.Item_quantity){
            setMessage({error: 'All fields are required!', success: ''});
            return;
        }
        if(isNaN(newItem.Restock_level)){
            setMessage({error: 'Restock level should be a number.'});
            return;
        }
        try {
            const response = await fetch('/api/inventory/create-unit', {
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
                    Item_quantity: '',
                    Item_shop_price: '',
                    Item_supply_price: '',
                    Kiosk_ID: '',
                    Restock_level: '',
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
            'Item_quantity': 'e.g. 100',
            'Item_shop_price': 'e.g. 25.00',
            'Item_supply_price': 'e.g. 1.25',
            'Restock_level': 'e.g. 15'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-grid">
                        {['Item_name', 'Item_type', 'Item_desc', 'Item_quantity', 'Item_shop_price', 'Item_supply_price', 'Kiosk_ID', 'Restock_level'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field}
                                type={field === 'Item_supply_price' ? 'number' : field === 'Item_shop_price' ? 'number' : field === 'Restock_level' ? 'number' : field === 'Item_quantity' ? 'number' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={newItem[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit" className="button button-block">Add Item</button>
                        <button type="button" onClick={onClose} className="button button-block cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItem;