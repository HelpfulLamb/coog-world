import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', paddingBottom: '2rem' }}>

      {/* 🔥 SEASON PASS BANNER */}
      <div style={{
        backgroundColor: '#c8102e',
        color: 'white',
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '1.75rem',
        fontWeight: 'bold'
      }}>
        🎉 2025 Season Passes NOW AVAILABLE! Buy Today & Save 🎟️
      </div>

      {/* 🏞️ PARK WELCOME */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        <h1 style={{ fontSize: '3rem', color: '#c8102e' }}>Welcome to Coog World!</h1>
        <p style={{
           fontSize: '1.25rem',
           maxWidth: '700px',
           margin: '1rem auto',
           color: '#444'
        }}>
            Coog World is Houston's #1 stop for all things fun, friendly, and frightening!<br />
            You won't be worrying about tuition costs with THIS Cougar Spirit!
        </p>
      </section>

      {/* 🎟️ TICKETS OVERVIEW */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        padding: '2rem'
      }}>
        <div style={cardStyle}>
          <h2>🎟️ Tickets</h2>
          <p>Choose the pass that fits your adventure: single day, weekend, or season!</p>
          <Link to="/tickets" className="fancy">View Ticket Options</Link>
        </div>

        <div style={cardStyle}>
          <h2>🎢 Rides</h2>
          <p>From kid-friendly coasters to jaw-dropping thrill rides, we’ve got it all.</p>
          <Link to="/services" className="fancy">Explore Attractions</Link>
        </div>

        <div style={cardStyle}>
          <h2>🍔 Shops & Perks</h2>
          <p>Enjoy food, games, and exclusive Coog World merchandise throughout the park!</p>
          <Link to="/shop" className="fancy">Browse Shops</Link>
        </div>
      </section>

    </div>
  );
}

// ✨ Transparent card style so they float on background image
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
  padding: '2rem',
  maxWidth: '300px',
  backgroundColor: 'rgba(255, 255, 255, 1)', // slightly see-through white
  textAlign: 'center'
};

export default Home;