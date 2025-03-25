import { Link } from 'react-router-dom';
import logo from '../../images/coogworldlogo.png';

function Header(){
    return(
        <nav className="nav-main">
            <div className="header-container">
                <Link to='/'>
                    <img 
                        src={logo} 
                        alt="CoogWorld Logo"
                        id="site-logo"
                        style={{ height: '90px', objectFit: 'contain' }}
                    />
                </Link>
                <ul className="header-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                    <li><Link to="/shop" className="nav-link">Shop</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>
                    <li><Link to="/contact" className="nav-link">Contact</Link></li>
                    <li><Link to="/registration" className="nav-link">Register</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;