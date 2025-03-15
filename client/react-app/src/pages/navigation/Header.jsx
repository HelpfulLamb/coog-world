import { Link } from 'react-router-dom';
function Header(){
    return(
        <nav className="nav-main">
            <div className="header-container">
                <h1 id="site-title">CoogWorld</h1>
                <ul className="header-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
                    <li><Link to="/cart" className="nav-link">Cart</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>
                    <li><Link to="/contact" className="nav-link">Contact</Link></li>
                    <li><Link to="/registration" className="nav-link">Register</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Header