import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Home() {
  return <h2>Welcome to CoogWorld!</h2>;
}

function BuyTickets() {
  return <h2>Buy Tickets Page</h2>;
}

function Cart() {
  return <h2>Your Cart</h2>;
}

function Ride() {
  return <h2>Available Rides</h2>;
}

function App() {
  return (
    <Router>
      <Header />
      
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/buy-tickets">Buy Tickets</Link> | 
        <Link to="/cart">Cart</Link> | 
        <Link to="/rides">Rides</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy-tickets" element={<BuyTickets />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rides" element={<Ride />} />
      </Routes>

      {/* Footer Component */}
      <Footer />
    </Router>
  );
}

export default App;
