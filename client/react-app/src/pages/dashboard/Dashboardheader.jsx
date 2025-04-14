import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './Dashboard.css';

const DashboardHeader = ({ handleLogout }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const firstName =
                parsedUser.First_name ||
                parsedUser.first_name ||
                parsedUser.firstName ||
                parsedUser.fname;
            const lastName =
                parsedUser.Last_name ||
                parsedUser.last_name ||
                parsedUser.lastName ||
                parsedUser.lname;
    
            if (firstName || lastName) {
                setUserName(`${firstName || ''} ${lastName || ''}`.trim());
            } else {
                console.warn("User name not found in localStorage:", parsedUser);
            }
        } else {
            console.warn("No user found in localStorage.");
        }
    }, []);

    return (
        <header className="dashboard-header">
            <Link to="/employee-dashboard" className="dashboard-title">
                <h1>Coog World Dashboard</h1>
            </Link>

            <div className="user-info">
                {userName && (
                    <Link to="/employee-dashboard/employee-profile" className="profile-link">
                        Welcome, {userName}
                    </Link>
                )}
                <button onClick={handleLogout} className="db-logout-button">Log Out</button>
            </div>
        </header>
    );
};

export default DashboardHeader;