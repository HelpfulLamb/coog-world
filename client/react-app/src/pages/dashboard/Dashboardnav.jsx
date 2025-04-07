import React from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

const DashboardNav = () => {
    return(
        <nav className="dashboard-nav">
            <ul>
                <li><Link to={'/employee-dashboard'}>Home</Link></li>
                <li><Link to={'/employee-dashboard/employees'}>Employees</Link></li> {/* create, remove, update employee information */}
                <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li> {/* create, remove, update ride information */}
                <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li> {/* will contain info on shops and booths ; sales*/}
                <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li> {/* create, remove, update show information */}
                <li><Link to={'/employee-dashboard/ticket-report'}>Tickets</Link></li> {/* create, remove, update ticket information ; sales */}
                <li><Link to={'/employee-dashboard/items'}>Items</Link></li>
                <li><Link to={'/employee-dashboard/inventory-report'}>Inventory</Link></li> {/* will contain info on items and inventory */}
                <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Report</Link></li> {/* display maintenance report (things needing maintenance, dates of maintenance) */}
                <li><Link to={'/employee-dashboard/weather-report'}>Weather Report</Link></li> {/* display weather report */}
                <li><Link to={'/employee-dashboard/reports'}>Reports</Link></li> {/* display query reports */}
            </ul>
        </nav>
    )
}

export default DashboardNav;