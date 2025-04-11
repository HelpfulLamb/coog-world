import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Logout } from '../registration/Login';
import logo from '../../images/coogworldlogo.png';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useAuth(); 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);
    const handleLogout = () => {
        Logout(navigate); 
        setIsAuthenticated(false); 
        setIsSidebarOpen(false);
    };
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    return (
        <>
            {/* 🔥 Hamburger Icon */}
            <div className="hamburger" onClick={toggleSidebar}>
                &#9776;
            </div>

            {/* 🧭 Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                <nav className="sidebar-nav">
                    <Link to="/home" onClick={toggleSidebar}>Home</Link>
                    <Link to="/tickets" onClick={toggleSidebar}>Tickets</Link>
                    <Link to="/shop" onClick={toggleSidebar}>Shop</Link>
                    <Link to="/parkrides" onClick={toggleSidebar}>Rides</Link>
                    <Link to="/parkshows" onClick={toggleSidebar}>Shows</Link>
                    {isAuthenticated && (
                        <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
                    )}
                    {isAuthenticated ? (
                        <Link to="/login" onClick={handleLogout}>Logout</Link>
                    ) : (
                        <Link to="/login" onClick={toggleSidebar}>Login</Link>
                    )}
                </nav>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            {/* 🧢 Main Header */}
            <nav className="nav-main">
                <div className="header-container">
                    <Link to='/'>
                        <img src={logo} alt="CoogWorld Logo" id="site-logo" draggable="false" />
                    </Link>

                    {/* Desktop Nav Links (optional) */}
                    <ul className="header-list">
                        <li><Link to="/home" className="nav-link">Home</Link></li>
                        <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                        <li><Link to="/shop" className="nav-link">Shop</Link></li>
                        <li><Link to="/parkrides" className='nav-link'>Rides</Link></li>
                        <li><Link to="/parkshows" className='nav-link'>Shows</Link></li>
                        {isAuthenticated && (
                            <li><Link to="/profile" className="nav-link">Profile</Link></li>
                        )}
                        {isAuthenticated ? (
                            <li>
                                <Link onClick={handleLogout} to='/login' className='nav-link logout-button'>Logout</Link>
                            </li>
                        ) : (
                            <li><Link to='/login' className='nav-link'>Login</Link></li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Header;