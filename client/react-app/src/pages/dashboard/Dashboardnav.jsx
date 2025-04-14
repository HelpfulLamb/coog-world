import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

const DashboardNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role?.toLowerCase();

    const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);
    const [isInvDropdownOpen, setIsInvDropdownOpen] = useState(false);
    const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
    const [isShowDropdownOpen, setIsShowDropdownOpen] = useState(false);
    const [isMaintDropdownOpen, setIsMaintDropdownOpen] = useState(false);
    const [isRideDropdownOpen, setIsRideDropdownOpen] = useState(false);

    const toggleWeatherDropdown = () => {
        setIsWeatherDropdownOpen(prev => !prev);
    };
    const toggleInvDropdown = () => {
        setIsInvDropdownOpen(prev => !prev);
    };
    const toggleEmpDropdown = () => {
        setIsEmpDropdownOpen(prev => !prev);
    };
    const toggleReportsDropdown = () => { 
        setIsReportsDropdownOpen(prev => !prev);
    };
    const toggleShowDropdown = () => {
        setIsShowDropdownOpen(prev => !prev);
    };
    const toggleMaintDropdown = () => {
        setIsMaintDropdownOpen(prev => !prev);
    };
    const toggleRideDropdown = () => {
        setIsRideDropdownOpen(prev => !prev);
    };

    return (
        <nav className="dashboard-nav">
            <ul>
                <li><Link to={'/employee-dashboard/hours'}>Hours</Link></li>
                {(role === 'admin' || role === 'manager') && (
                    <>
                        <li className="dropdown">
                            <button onClick={toggleEmpDropdown}>
                                Employees
                                <span className={`arrow-icon ${isEmpDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isEmpDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/employees'}>Employee List</Link></li>
                                    <li><Link to={'/employee-dashboard/attendance'}>Attendance</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <button onClick={toggleRideDropdown}>
                                Rides
                                <span className={`arrow-icon ${isRideDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isRideDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                                    <li><Link to={'/employee-dashboard/ride-frequency'}>Ride Report</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li className="dropdown">
                            <button onClick={toggleShowDropdown}>
                                Shows
                                <span className={`arrow-icon ${isShowDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isShowDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/shows'}>Shows List</Link></li>
                                    <li><Link to={'/employee-dashboard/show-report'}>Show Report</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to={'/employee-dashboard/stages'}>Stages</Link></li>
                        {(role === 'admin') && (
                            <li><Link to={'/employee-dashboard/ticket-report'}>Tickets</Link></li>
                        )}
                        <li className="dropdown">
                            <button onClick={toggleInvDropdown}>
                                Inventory
                                <span className={`arrow-icon ${isInvDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isInvDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/items'}>Items List</Link></li>
                                    <li><Link to={'/employee-dashboard/inventory-report'}>Inventory Management</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <button onClick={toggleMaintDropdown}>
                                Maintenance
                                <span className={`arrow-icon ${isMaintDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isMaintDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Logs</Link></li>
                                    <li><Link to={'/employee-dashboard/park-maintenance'}>Park Maintenance Report</Link></li>
                                </ul>
                            )}
                        </li>
                    </>
                )}
                {role === 'admin' && (
                    <>
                        <li className="dropdown">
                            <button onClick={toggleWeatherDropdown} className="dropdown-btn">
                                Weather
                                <span className={`arrow-icon ${isWeatherDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isWeatherDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to={'/employee-dashboard/weather-report'}>Weather Logs</Link></li>
                                    <li><Link to={'/employee-dashboard/rainout-report'}>Rainout Report</Link></li>
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
                                    <li><Link to={'/employee-dashboard/ticket-sales-trends'}>Ticket Sales Trends</Link></li>
                                    <li><Link to={'/employee-dashboard/customer-trends-report'}>Customer Trends Report</Link></li>
                                </ul>
                            )}
                        </li>
                    </>
                )}

                {role === 'maintenance' && (
                    <>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/stages'}>Stages</Link></li>
                        <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Report</Link></li>
                        <li><Link to={'/employee-dashboard/park-maintenance'}>Park Maintenance</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default DashboardNav;