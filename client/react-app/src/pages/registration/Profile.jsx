import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Profile.css';

const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');

    if (cleaned.length === 10) {
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return cleaned;
};


function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [showTickets, setShowTickets] = useState(false);
    const [showPurchases, setShowPurchases] = useState(false);
    const [rides, setRides] = useState([]);
    const [showRides, setShowRides] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData(parsedUser);
            fetchData(parsedUser.id || parsedUser.Visitor_ID);
        }
    }, []);

    const fetchData = async (userId) => {
        try {
            const ticketRes = await fetch(`/api/ticket-type/purchases/${userId}`);
            const ticketData = await ticketRes.json();
            setTickets(ticketData.tickets);

            const shopRes = await fetch(`/api/shop-purchases/${userId}`);
            const shopData = await shopRes.json();
            setPurchases(shopData.purchases);
            const rideRes = await fetch(`/api/rides/history/${userId}`);
            const rideData = await rideRes.json();
            setRides(rideData.rides);

        } catch (err) {
            console.error('Error fetching user-related data:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = async () => {
        const userId = user.id || user.Visitor_ID;
        const updatedData = {
            ...user,
            ...formData,
            email: formData.email || user.email,
        };

        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
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
            const userId = user.id || user.Visitor_ID;
            const response = await fetch(`/api/users/${userId}`, {
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
            <h1 className="profile-header">Coog Profile</h1>
            <div className="profile-info">
                {isEditing ? (
                    <>
                        <label>First Name:</label>
                        <input name="first_name" value={formData.first_name || ''} onChange={handleChange} />

                        <label>Last Name:</label>
                        <input name="last_name" value={formData.last_name || ''} onChange={handleChange} />

                        <label>Email:</label>
                        <input name="email" value={formData.email || ''} onChange={handleChange} />

                        <label>Phone:</label>
                        <input name="phone" value={formData.phone || ''} onChange={handleChange} />

                        <label>Address:</label>
                        <input name="address" value={formData.address || ''} onChange={handleChange} />

                        <button onClick={handleEdit} className='profile-button'>✅ Save Changes</button>
                        <button onClick={() => setIsEditing(false)} className='profile-button'>❌ Cancel</button>
                    </>
                ) : (
                    <>
                        <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {formatPhoneNumber(user.phone)}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <button onClick={() => setIsEditing(true)} className='profile-button'>✏️ Edit Profile</button>
                        <button onClick={handleDelete} className='profile-button'>🗑 Delete Account</button>
                    </>
                )}
            </div>

            <div className="tickets">
                <button className="toggle-section" onClick={() => setShowTickets(!showTickets)}>
                    {showTickets ? 'Hide Tickets' : 'Your Tickets'}
                </button>
                {showTickets && (
                    <ul className="profile-list">
                        {tickets.map((ticket, index) => (
                            <li key={index}>
                                Ticket Type: {ticket.type} | Quantity: {ticket.quantity} | Date: {new Date(ticket.date).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="shop-purchases">
                <button className="toggle-section" onClick={() => setShowPurchases(!showPurchases)}>
                    {showPurchases ? 'Hide Shop Purchases' : 'Your Shop Purchases'}
                </button>
                {showPurchases && (
                    <ul className="profile-list">
                        {purchases.map((purchase, index) => (
                            <li key={index}>
                                Item: {purchase.item} | Price: ${purchase.price} | Date: {new Date(purchase.date).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="ride-history">
  <button className="toggle-section" onClick={() => setShowRides(!showRides)}>
    {showRides ? 'Hide Ride History' : 'Your Ride History'}
  </button>
  {showRides && (
    <ul className="profile-list">
      {rides.map((ride, index) => (
        <li key={index}>
          Ride: {ride.Ride_name} | Type: {ride.Ride_type} | Date: {new Date(ride.ride_date).toLocaleString()}
        </li>
      ))}
    </ul>
  )}
</div>

        </div>
    );
}

export default Profile;