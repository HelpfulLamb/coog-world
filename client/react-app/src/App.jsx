import './App.css'
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './pages/navigation/Header.jsx';
import Home from './pages/Home.jsx';
import Tickets from './pages/Buy-tickets.jsx';
import Services from './pages/Services.jsx';
import Cart from './pages/Cart.jsx';
import Shop from './pages/shops/Shops.jsx';
import Parkshops from './pages/shops/Parkshops.jsx';
import Merchandise from './pages/shops/Merchandise.jsx';
import Contact from './pages/Contact.jsx';
import Register from './pages/registration/Register.jsx';
import Login from './pages/registration/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Footer from './pages/navigation/Footer.jsx';

import Employee from './pages/operations/Employees.jsx';
import Ride from './pages/operations/Ride.jsx';
import Kiosk from './pages/operations/Kiosks.jsx';
import Show from './pages/operations/Shows.jsx';

function App() {
    const location = useLocation();
    const isEmployeeDashboard = location.pathname.startsWith('/employee-dashboard')
    return(
        <>
            <div id='root'>
                {!isEmployeeDashboard && <Header />}
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/tickets' element={<Tickets />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/shop' element={<Shop />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/registration' element={<Register />} />
                    <Route path='/parkshops' element={<Parkshops />} />
                    <Route path='/merch' element={<Merchandise />} />
                    <Route path='/employee-dashboard' element={<Dashboard />}>
                        <Route path='employees' element={<Employee />} />
                        <Route path='rides' element={<Ride />} />
                        <Route path='shows' element={<Show />} />
                        <Route path='kiosks' element={<Kiosk />} />
                    </Route>
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
                {!isEmployeeDashboard && <Footer />}
            </div>
        </>
    );
}

export default App;