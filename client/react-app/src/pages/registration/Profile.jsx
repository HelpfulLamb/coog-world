import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Profile.css';

const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) return `(${match[1]}) ${match[2]} - ${match[3]}`;
    }
    return cleaned;
};

function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [upcomingTickets, setUpcomingTickets] = useState([]);
    const [pastTickets, setPastTickets] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [showTickets, setShowTickets] = useState(false);
    const [showPurchases, setShowPurchases] = useState(false);
    const [rides, setRides] = useState([]);
    const [showRides, setShowRides] = useState(false);

    const {cartItems} = useCart();

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
            const today = new Date().setHours(0, 0, 0, 0);
            const upcoming = [], past = [];
            ticketData.tickets.forEach(ticket => {
                const visitDate = new Date(ticket.date).setHours(0, 0, 0, 0);
                (visitDate >= today ? upcoming : past).push(ticket);
            });
            setUpcomingTickets(upcoming);
            setPastTickets(past);
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
        const updatedData = { ...user, ...formData, email: formData.email || user.email };
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
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            const userId = user.id || user.Visitor_ID;
            const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                localStorage.removeItem('user');
                navigate('/registration');
            } else {
                alert('Failed to delete account.');
            }
        }
    };
    const groupByDate = (tickets) => {
        return tickets.reduce((acc, ticket) => {
            const date = new Date(ticket.date).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(ticket);
            return acc;
        }, {});
    };
    
    if (!user) return <div className="loading">Loading user data...</div>;
    return (
        <div className='profile-page'>
            <div className="profile-page-container">
                <div className="profile-header-container">
                    <h1 className="profile-main-title">My Profile</h1>
                    <p className="profile-welcome">Welcome back, {user.first_name}!</p>
                </div>
                <div className="profile-content-container">
                    {/* Profile Information Section */}
                    <section className="profile-section profile-information">
                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleEdit} className="profile-btn profile-btn-save">Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} className="profile-btn profile-btn-cancel">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="profile-btn profile-btn-edit">Edit Profile</button>
                                    <button onClick={handleDelete} className="profile-btn profile-btn-delete">Delete Account</button>
                                </>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="profile-edit-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-view">
                                <div className="profile-avatar">
                                    <span>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</span>
                                </div>
                                <div className="profile-details">
                                    <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                                    <div className="profile-detail">
                                        <span className="detail-label">Email:</span>
                                        <span className="detail-value">{user.email}</span>
                                    </div>
                                    <div className="profile-detail">
                                        <span className="detail-label">Phone:</span>
                                        <span className="detail-value">{formatPhoneNumber(user.phone) || 'Not provided'}</span>
                                    </div>
                                    <div className="profile-detail">
                                        <span className="detail-label">Address:</span>
                                        <span className="detail-value">{user.address || 'Not provided'}</span>
                                    </div>
                                </div>
                                <div>
                                    <ul>
                                        <li><Link to="/cart" className="nav-link">View Your Cart ({cartItems.length})</Link></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>
                    <section className="profile-section profile-tickets">
                        <div className="section-header" onClick={() => setShowTickets(!showTickets)}>
                            <h3>Tickets & Visits</h3>
                            <span className="toggle-icon">
                                {showTickets ? '▼' : '►'}
                            </span>
                        </div>
                        {showTickets && (
                            <div className="section-content">
                                <div className="ticket-category">
                                    <h4>Upcoming Visits</h4>
                                    {upcomingTickets.length > 0 ? (
                                        <div className="ticket-list">
                                            {Object.entries(groupByDate(upcomingTickets))
  .sort(([a], [b]) => new Date(a) - new Date(b)) // sort dates ascending
  .map(([date, ticketsOnDate], index) => {
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const dayTotal = ticketsOnDate.reduce((sum, t) => sum + parseFloat(t.total), 0);
    
    return (
      <div key={`group-${index}`} className="ticket-date-group">
        <h5 style={{ marginBottom: '0.5rem' }}>{formattedDate}</h5>
        {ticketsOnDate.map((ticket, subIndex) => (
          <div key={`ticket-${subIndex}`} className="ticket-item">
            <div className="ticket-type purchase-header">
              <span>{ticket.type}</span>
              <span className='purchase-price'>${parseFloat(ticket.total).toFixed(2)}</span>
            </div>
            <div className="ticket-meta">
              <span>Qty: {ticket.quantity}</span>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.25rem' }}>
          Total: ${dayTotal.toFixed(2)}
        </div>
      </div>
    );
})}

                                        </div>
                                    ) : (
                                        <p className="no-items">No upcoming visits scheduled</p>
                                    )}
                                </div>
                                <div className="ticket-category">
                                    <h4>Past Visits</h4>
                                    {pastTickets.length > 0 ? (
                                        <div className="ticket-list past-tickets">
                                            {pastTickets.map((ticket, index) => (
                                                <div key={`past-${index}`} className="ticket-item">
                                                    <div className="ticket-type purchase-header">
                                                        <span>{ticket.type}</span>
                                                        <span className='purchase-price'>${parseFloat(ticket.total).toFixed(2)}</span>
                                                    </div>
                                                    <div className="ticket-meta">
                                                        <span>Qty: {ticket.quantity}</span>
                                                        <span>Date: {new Date(ticket.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-items">No past visits recorded</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                    <section className="profile-section profile-purchases">
                        <div className="section-header" onClick={() => setShowPurchases(!showPurchases)}>
                            <h3>Shop Purchases</h3>
                            <span className="toggle-icon">
                                {showPurchases ? '▼' : '►'}
                            </span>
                        </div>
                        {showPurchases && (
                            <div className="section-content">
                                {purchases.length > 0 ? (
                                    <div className="purchase-list">
                                        {purchases.map((purchase, index) => (
                                            <div key={index} className="purchase-item">
                                                <div className="purchase-header">
                                                    <span className="purchase-name">{purchase.item}</span>
                                                    <span className="purchase-price">${parseFloat(purchase.total_price).toFixed(2)}</span>
                                                </div>
                                                <div className="purchase-meta">
                                                    <span>Qty: {purchase.quantity}</span>
                                                    <span>Date: {new Date(purchase.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-items">No purchases found</p>
                                )}
                            </div>
                        )}
                    </section>
                    <section className="profile-section profile-rides">
                        <div className="section-header" onClick={() => setShowRides(!showRides)}>
                            <h3>Ride History</h3>
                            <span className="toggle-icon">
                                {showRides ? '▼' : '►'}
                            </span>
                        </div>
                        {showRides && (
                            <div className="section-content">
                                {rides.length > 0 ? (
                                    <div className="ride-list">
                                        {rides.map((ride, index) => (
                                            <div key={index} className="ride-item">
                                                <div className="ride-name">{ride.Ride_name}</div>
                                                <div className="ride-meta">
                                                    <span className="ride-type">{ride.Ride_type}</span>
                                                    <span className="ride-date">{new Date(ride.ride_date).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-items">No ride history available</p>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Profile;