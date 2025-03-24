import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Logout } from '../registration/Login';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    const handleLogout = () => {
        Logout(navigate); // Use the Logout function
        setIsAuthenticated(false); // Update state
    };

    return (
        <nav className="nav-main">
            <div className="header-container">
                <h1>
                    <Link to='/' id="site-title">CoogWorld</Link>
                </h1>
                <ul className="header-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/about-us" className="nav-link">About Us</Link></li>
                    <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                    <li><Link to="/shop" className="nav-link">Shop</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>
                    {isAuthenticated ? (
                        <li>
                            <button onClick={handleLogout} className='nav-link logout-button'>Logout</button>
                        </li>
                    ) : (
                        <li><Link to='/login' className='nav-link'>Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Header;