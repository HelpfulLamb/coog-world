import React from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

const DashboardNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role?.toLowerCase();
    return(
        <nav className="dashboard-nav">
            <ul>
                <li><Link to={'/employee-dashboard'}>Home</Link></li>
                {(role === 'admin' || role === 'manager') && (
                    <>
                        <li><Link to={'/employee-dashboard/employees'}>Employees</Link></li>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li>
                        <li><Link to={'/employee-dashboard/ticket-report'}>Tickets</Link></li>
                        <li><Link to={'/employee-dashboard/items'}>Items</Link></li>
                        <li><Link to={'/employee-dashboard/inventory-report'}>Inventory</Link></li>
                        <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Report</Link></li>
                        <li><Link to={'/employee-dashboard/weather-report'}>Weather Report</Link></li>
                        <li><Link to={'/employee-dashboard/report'}>Reports</Link></li>
                    </>
                )}

                {role === 'maintenance' && (
                    <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Report</Link></li>
                )}
            </ul>
        </nav>
    )
}

export default DashboardNav;