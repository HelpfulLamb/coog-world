import React from "react";
import './Dashboard.css';

const DashboardHeader = ({handleLogout}) => {
    return(
        <header className="dashboard-header">
            <h1>Coog World Dashboard</h1>
            <button onClick={handleLogout} className="db-logout-button">Log Out</button>
        </header>
    )
}

export default DashboardHeader;