import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData(parsedUser);
            fetchData(parsedUser.id);
        }
    }, []);

    const fetchData = async (userId) => {
        try {
            const ticketRes = await fetch(`/api/orders/${userId}`);
            const ticketData = await ticketRes.json();
            setTickets(ticketData.tickets);

            const shopRes = await fetch(`/api/shop-purchases/${userId}`);
            const shopData = await shopRes.json();
            setPurchases(shopData.purchases);
        } catch (err) {
            console.error('Error fetching user-related data:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = async () => {
        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            alert('Profile updated successfully!');
            setIsEditing(false);
        } else {
            alert(data.message || 'Update failed.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                localStorage.removeItem('user');
                navigate('/register');
            } else {
                alert('Failed to delete account.');
            }
        }
    };

    if (!user) return <p>Loading user data...</p>;

    return (
        <div className="profile-container">
            <h1 className="profile-header">User Profile</h1>

            <div className="profile-info">
                {isEditing ? (
                    <>
                        <label>First Name:</label>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} />

                        <label>Last Name:</label>
                        <input name="last_name" value={formData.last_name} onChange={handleChange} />

                        <label>Email:</label>
                        <input name="email" value={formData.email} readOnly />

                        <label>Phone:</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} />

                        <label>Address:</label>
                        <input name="address" value={formData.address} onChange={handleChange} />

                        <button onClick={handleEdit}>✅ Save Changes</button>
                        <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
                    </>
                ) : (
                    <>
                        <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <button onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                        <button onClick={handleDelete}>🗑 Delete Account</button>
                    </>
                )}
            </div>

            <div className="tickets">
                <h3 className="title-header">Your Tickets</h3>
                <ul className="profile-list">
                    {tickets.map((ticket, index) => (
                        <li key={index}>
                            Ticket Type: {ticket.type} | Date: {ticket.date}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="shop-purchases">
                <h3 className="title-header">Your Shop Purchases</h3>
                <ul className="profile-list">
                    {purchases.map((purchase, index) => (
                        <li key={index}>
                            Item: {purchase.item} | Price: ${purchase.price} | Date: {purchase.date}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Profile;
