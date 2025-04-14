import './App.css';
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import {Toaster} from 'react-hot-toast';

// Navigation Components
import Header from './pages/navigation/Header.jsx';
import Footer from './pages/navigation/Footer.jsx';

// Public Pages
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
import Profile from './pages/registration/Profile.jsx';
import ParkRides from './pages/View-Rides.jsx';
import ParkShows from './pages/View-Shows.jsx';

// Employee Dashboard & Operations
import Dashboard from './pages/dashboard/Dashboard.jsx';
import AdminHome from './pages/operations/Home.jsx';
import Revenue from './pages/operations/Revenue.jsx';
import EmployeeProfile from './pages/operations/EmployeeProfile.jsx';
import Employee from './pages/operations/Employees.jsx';
import Ride from './pages/operations/Ride.jsx';
import Kiosk from './pages/operations/Kiosks.jsx';
import Show from './pages/operations/Shows.jsx';
import TicketReport from './pages/operations/Tickets.jsx';
import Item from './pages/operations/Items.jsx';
import Inventory from './pages/operations/Inventory.jsx';
import Maintenance from './pages/operations/MaintenanceReport.jsx';
import Weather from './pages/operations/WeatherReport.jsx';
import Reports from './pages/operations/Reports.jsx';
import Rainout from './pages/operations/Rainout.jsx';
import ClockInOut from './pages/operations/ClockInOut.jsx';
import AttendanceReport from './pages/reports/AttendanceReport.jsx';
import TicketSalesTrends from './pages/operations/TicketSalesTrends.jsx';
import CustomerTrendsChart from './pages/operations/CustomerTrendsChart.jsx';
import PopularShows from './pages/reports/ShowsReport.jsx';
import Attendance from './pages/operations/Attendance.jsx';
import Stage from './pages/operations/Stage.jsx'; 
import RideFrequencyReport from './pages/reports/RideFrequency.jsx';
import ParkMaintenanceReport from './pages/reports/MaintLog.jsx';

function App() {
  const location = useLocation();
  const isEmployeeDashboard = location.pathname.startsWith('/employee-dashboard');

  return (
    <AuthProvider>
            <CartProvider> {/* ✅ wrap inside AuthProvider */}
                <div className="app-container">
                    <Toaster position='top-right' reverseOrder={false} />
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
                        <Route path='/parkshows' element={<ParkShows />} />
                        <Route path='/merch' element={<Merchandise />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/employee-dashboard' element={<Dashboard />}>
                            <Route index element={<AdminHome />} />
                            <Route path='employee-profile' element={<EmployeeProfile/>}/>
                            <Route path='employees' element={<Employee />} />
                            <Route path='rides' element={<Ride />} />
                            <Route path='ride-frequency' element={<RideFrequencyReport />} />
                            <Route path='shows' element={<Show />} />
                            <Route path='show-report' element={<PopularShows />} />
                            <Route path='kiosks' element={<Kiosk />} />
                            <Route path='stages' element={<Stage />} />
                            <Route path='ticket-report' element={<TicketReport />} />
                            <Route path='items' element={<Item />} />
                            <Route path='inventory-report' element={<Inventory />} />
                            <Route path='maintenance-report' element={<Maintenance />} />
                            <Route path='park-maintenance' element={<ParkMaintenanceReport />} />
                            <Route path='weather-report' element={<Weather />} />
                            <Route path='report' element={<Reports />} />
                            <Route path='rainout-report' element={<Rainout />}/>
                            <Route path='hours' element={<ClockInOut />}/>
                            <Route path='attendance' element={<Attendance />}/>
                            <Route path='attendance-report' element={<AttendanceReport />} />
                            <Route path='revenue-report' element={<Revenue />}/>
                            <Route path='ticket-sales-trends' element={<TicketSalesTrends />} />
                            <Route path='customer-trends-report' element={<CustomerTrendsChart />} />

                        </Route>
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                    {!isEmployeeDashboard && <Footer />}
                </div>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
