import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    color: '#222',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    minHeight: '120px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  };

  const valueStyle = {
    color: '#c8102e',
    fontSize: '1.4rem',
    marginTop: '0.5rem'
  };

  const quickButtonStyle = {
    backgroundColor: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '2px 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    color: '#000'
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
        🎡 CoogWorld Admin Overview
      </h1>

      {/* Top Cards */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={cardStyle}>
          💰 Total Revenue
          <div style={valueStyle}>$12,750</div>
        </div>
        <div style={cardStyle}>
          🎟️ Tickets Sold Today
          <div style={valueStyle}>1,204</div>
        </div>
        <div style={cardStyle}>
          📈 Daily Visitors
          <div style={valueStyle}>3,458</div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          🛠️ Open Maintenance Requests
          <div style={valueStyle}>7</div>
        </div>
        <div style={cardStyle}>
          🌤️ Current Weather
          <div style={valueStyle}>Sunny, 85°F</div>
        </div>
      </div>

      {/* Quick Access Section */}
      <h2 style={{ color: '#c8102e', marginBottom: '1rem' }}>Quick Access:</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/employee-dashboard/employees" style={quickButtonStyle}>Manage Employees</Link>
        <Link to="/employee-dashboard/ticket-report" style={quickButtonStyle}>Ticket Reports</Link>
        <Link to="/employee-dashboard/inventory-report" style={quickButtonStyle}>Inventory</Link>
        <Link to="/employee-dashboard/maintenance-report" style={quickButtonStyle}>Maintenance</Link>
        <Link to="/employee-dashboard/weather-report" style={quickButtonStyle}>Weather</Link>
      </div>
    </div>
  );
};

export default Home;
