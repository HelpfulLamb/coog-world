import React from "react";
import './Dashboard.css';

const DashboardHeader = ({handleLogout}) => {
    return(
        <header className="dashboard-header">
            <h1>CoogWorld Dashboard</h1>
            <button onClick={handleLogout} className="logout-button">Log Out</button>
        </header>
    )
}

export default DashboardHeader;