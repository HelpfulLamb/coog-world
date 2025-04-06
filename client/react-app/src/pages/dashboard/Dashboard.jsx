import React, { useEffect } from 'react';
import {useNavigate, Outlet} from 'react-router-dom';
import './Dashboard.css';
import DashboardHeader from './Dashboardheader';
import DashboardNav from './Dashboardnav';
import { Logout } from '../registration/Login';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    const handleLogout = () => {
        Logout(navigate);
        setIsAuthenticated(false);
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