import React, { useState } from 'react';
import {useNavigate, Outlet} from 'react-router-dom';
import './Dashboard.css';
import DashboardHeader from './Dashboardheader';
import DashboardNav from './Dashboardnav';
import { Logout } from '../registration/Login';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Logout(navigate);
    };

    return (
        <div className="dashboard-container">
            <DashboardHeader handleLogout={handleLogout} />
            <div className='dashboard-content'>
                <DashboardNav />
                <main className='dashboard-main'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;