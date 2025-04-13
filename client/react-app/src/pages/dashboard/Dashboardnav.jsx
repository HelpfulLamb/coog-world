import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

const DashboardNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role?.toLowerCase();

    const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false); // State for Reports dropdown

    const toggleWeatherDropdown = () => {
        setIsWeatherDropdownOpen(prev => !prev);
    };

    const toggleReportsDropdown = () => { // Toggle function for Reports dropdown
        setIsReportsDropdownOpen(prev => !prev);
    };

    return(
        <nav className="dashboard-nav">
            <ul>
                <li><Link to={'/employee-dashboard/hours'}>Hours</Link></li>
                {(role === 'manager') && (
                    <>
                        <li><Link to={'/employee-dashboard/employees'}>Employees</Link></li>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li>
                        <li><Link to={'/employee-dashboard/items'}>Items</Link></li>
                        <li><Link to={'/employee-dashboard/inventory-report'}>Inventory</Link></li>
                    </>
                )}
                {(role === 'admin' || role === 'manager') && (
                    <>
                        <li><Link to={'/employee-dashboard/employees'}>Employees</Link></li>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li>
                        <li><Link to={'/employee-dashboard/ticket-report'}>Tickets</Link></li>
                        <li><Link to={'/employee-dashboard/items'}>Items</Link></li>
                        <li><Link to={'/employee-dashboard/inventory-report'}>Inventory</Link></li>
                        <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance</Link></li>
                        <li className="dropdown">
                            <button onClick={toggleWeatherDropdown} className="dropdown-btn">
                                Weather
                                <span className={`arrow-icon ${isWeatherDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isWeatherDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to={'/employee-dashboard/weather-report'}>Weather Report</Link></li>
                                    <li><Link to={'/employee-dashboard/rainout-report'}>Rainouts</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <button onClick={toggleReportsDropdown} className="dropdown-btn">
                                Reports
                                <span className={`arrow-icon ${isReportsDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isReportsDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to={'/employee-dashboard/revenue-report'}>Revenue Report</Link></li>
                                </ul>
                            )}
                        </li>
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