import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const handleLogout = () => {
        // Handle logout logic here
        console.log('User  logged out');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome to the CoogWorld Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </header>
            <section className="user-info">
                <h2>Your Information</h2>
                <p>Username: just_a_username</p>
                <p>Email: user@example.com</p>
            </section>
            <section className="ticket-info">
                <h2>Your Tickets</h2>
                <ul>
                    <li>Ticket Type: Day Pass</li>
                    <li>Number of Tickets: 2</li>
                    <li>Visit Date: March 25, 2025</li>
                </ul>
            </section>
            <section className="park-updates">
                <h2>Park Updates</h2>
                <p>New rides opening this summer!</p>
                <p>Check out our special events happening this weekend!</p>
            </section>
        </div>
    );
};

export default Dashboard;