import React from 'react';
import { Link } from 'react-router-dom';
import Services from './Services.jsx';
import AboutUs from './AboutUs.jsx';

function Home() {
  return (
    <>
        <div className='top-banner'>
            🎉 2025 Season Passes NOW AVAILABLE! Buy Today & Save 🎟️
        </div>
        <section className='hero-section'>
            <div className="hero-content">
                <h1>Welcome to Coog World!</h1>
                <p>Houston's #1 stop for all things fun, friendly, and frightening!</p>
                <Link to='/tickets' className='hero-button'>Plan Your Visits</Link>
            </div>
        </section>
        <section className='info-section fade-in'>
            <div className='info-card'>
            <h2>🎟️ Tickets</h2>
            <p>Choose the pass that fits your adventure: single day, weekend, or season!</p>
            <Link to="/tickets" className="fancy">View Ticket Options</Link>
            </div>
            <div className='info-card'>
            <h2>🎢 Rides</h2>
            <p>From kid-friendly coasters to jaw-dropping thrill rides, we’ve got it all.</p>
            <Link to="/parkrides" className="fancy">Explore Attractions</Link>
            </div>
            <div className='info-card'>
            <h2>🎭 Shows</h2>
            <p>Form lasting memories through our spectacular shows.</p>
            <Link to="/parkshows" className="fancy">View Shows</Link>
            </div>
            <div className='info-card'>
            <h2>🍔 Shops & Perks</h2>
            <p>Enjoy food, games, and exclusive Coog World merchandise throughout the park!</p>
            <Link to="/shop" className="fancy">Browse Shops</Link>
            </div>
        </section>
        <Services />
        <AboutUs />
    </>
  );
}

export default Home;