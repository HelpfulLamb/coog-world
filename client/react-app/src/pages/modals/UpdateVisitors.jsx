import { useState, useEffect } from "react";

export function UpdateVisitor({isOpen, onClose, userToEdit, onUpdateUser}){
    const [formData, setFormData] = useState({
        First_name: '',
        Last_name: '',
        Email: '',
        Phone: '',
        Address: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(userToEdit){
            setFormData({
                First_name: userToEdit.First_name || '',
                Last_name: userToEdit.Last_name || '',
                Email: userToEdit.Email || '',
                Phone: userToEdit.Phone || '',
                Address: userToEdit.Address || '',
            });
        }
    }, [userToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/update/${userToEdit.Visitor_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'User updated successfully!', error: ''});
                if(onUpdateUser){
                    onUpdateUser();
                    setMessage({success: 'Visitor updated successfully!', error: ''});
                    setTimeout(() => {onClose();}, 1000);
                }
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the user.', success: ''});
        }
    };
    if(!isOpen || !userToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'First_name': 'e.g. John',
            'Last_name': 'e.g. Doe',
            'Email': 'e.g. example@example.com',
            'Phone': 'e.g. (123) 456 - 7890',
            'Address': 'e.g. 123 Main St, Houston, TX, 77004'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Visitor #{userToEdit.Visitor_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['First_name', 'Last_name', 'Email', 'Phone', 'Address'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input id={field} type="text" name={field} required autoComplete="off" value={formData[field]} onChange={handleInputChange} placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                        {message.error && <p className="error-message">{message.error}</p>}
                        {message.success && <p className="success-message">{message.success}</p>}
                        <div className="modal-buttons">
                            <button type="submit">Update Visitor</button>
                            <button type="button" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}