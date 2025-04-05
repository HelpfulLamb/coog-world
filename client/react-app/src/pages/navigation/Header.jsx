import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Logout } from '../registration/Login';
import logo from '../../images/coogworldlogo.png';

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
                <Link to='/'>
                    <img 
                        src={logo} 
                        alt="CoogWorld Logo"
                        id="site-logo"
                        style={{ height: '90px', objectFit: 'contain' }}
                        draggable="false"
                    />
                </Link>
                <ul className="header-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                    <li><Link to="/shop" className="nav-link">Shop</Link></li>
                    <li><Link to="/parkrides" className='nav-link'>Rides</Link></li>
                    <li><Link to="/parkshows" className='nav-link'>Shows</Link></li>
                    <li><Link to="/about-us" className="nav-link">About Us</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>

                    {isAuthenticated && (
                        <li><Link to="/profile" className="nav-link">Profile</Link></li>
                    )}

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