import { Link } from 'react-router-dom';
function Header(){
    return(
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
                    <li><Link to="/registration" className="nav-link">Register</Link></li>
                    <li><Link to="/login" className="nav-link">Login</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Header