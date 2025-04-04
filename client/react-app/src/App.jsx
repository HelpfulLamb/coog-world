import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './pages/navigation/Header.jsx';
import Home from './pages/Home.jsx';
import About from './pages/AboutUs.jsx';
import Tickets from './pages/Buy-tickets.jsx';
import Services from './pages/Services.jsx';
import Cart from './pages/Cart.jsx';
import Shop from './pages/shops/Shops.jsx';
import Parkshops from './pages/shops/Parkshops.jsx';
import Merchandise from './pages/shops/Merchandise.jsx';
import Register from './pages/registration/Register.jsx';
import Login from './pages/registration/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Profile from './pages/registration/Profile.jsx';
import ParkRides from './pages/View-Rides.jsx';
import Footer from './pages/navigation/Footer.jsx';

import Employee from './pages/operations/Employees.jsx';
import Ride from './pages/operations/Ride.jsx';
import Kiosk from './pages/operations/Kiosks.jsx';
import Show from './pages/operations/Shows.jsx';
import TicketReport from './pages/operations/Tickets.jsx';
import Inventory from './pages/operations/Inventory.jsx';
import Maintenance from './pages/operations/MaintenanceReport.jsx';
import Weather from './pages/operations/WeatherReport.jsx';

function App() {
    const location = useLocation();
    const isEmployeeDashboard = location.pathname.startsWith('/employee-dashboard');

    return (
        <AuthProvider>
            <div id='root'>
                {!isEmployeeDashboard && <Header />}
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/about-us' element={<About />} />
                    <Route path='/tickets' element={<Tickets />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/shop' element={<Shop />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/registration' element={<Register />} />
                    <Route path='/parkshops' element={<Parkshops />} />
                    <Route path='/parkrides' element={<ParkRides />} />
                    <Route path='/merch' element={<Merchandise />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/employee-dashboard' element={<Dashboard />}>
                        <Route path='employees' element={<Employee />} />
                        <Route path='rides' element={<Ride />} />
                        <Route path='shows' element={<Show />} />
                        <Route path='kiosks' element={<Kiosk />} />
                        <Route path='ticket-report' element={<TicketReport />} />
                        <Route path='inventory-report' element={<Inventory />} />
                        <Route path='maintenance-report' element={<Maintenance />} />
                        <Route path='weather-report' element={<Weather />} />
                    </Route>
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
                {!isEmployeeDashboard && <Footer />}
            </div>
        </AuthProvider>
    );
}

export default App;