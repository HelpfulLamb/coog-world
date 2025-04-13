import React from "react";
import { Link } from 'react-router-dom';
import './Dashboard.css';

const DashboardHeader = ({ handleLogout }) => {
    return (
        <header className="dashboard-header">
            <Link to="/employee-dashboard" className="dashboard-title">
                <h1>Coog World Dashboard</h1>
            </Link>
            <button onClick={handleLogout} className="db-logout-button">Log Out</button>
        </header>
    );
}

export default DashboardHeader;