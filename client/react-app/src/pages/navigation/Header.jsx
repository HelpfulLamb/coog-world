import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Logout } from '../registration/Login';

function Header(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if(authStatus === 'true'){
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        Logout(navigate);
    };

    return(
        <nav className="nav-main">
            <div className="header-container">
                <h1>
                    <Link to='/' id="site-title">CoogWorld</Link>
                </h1>
                <ul className="header-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                    <li><Link to="/shop" className="nav-link">Shop</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>
                    {isAuthenticated ? (
                        <li>
                            <button onClick={handleLogout} className='nav-link logout-button'>Logout</button>
                        </li>
                    ) : (
                        <>
                            <li><Link to='/login' className='nav-link'>Login</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Header