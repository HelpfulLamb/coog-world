import React, { use, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [revenue, setRevenue] = useState('Loading...');
  const [ticketCount, setTicketCount] = useState('Loading...');
  const [visitorCount, setVisitorCount] = useState('Loading...');
  const [maintenanceCount, setMaintenanceCount] = useState('Loading...');
  const [currentWeather, setCurrentWeather] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState([]);
  const [restockAlert, setRestockAlert] = useState([]);

  useEffect(() => {
    fetch('/api/weather/weather-alerts').then(res => res.json()).then(data => setWeatherAlert(data)).catch(err => console.error('Failed to load weather alerts:', err));
    fetch('/api/inventory/restock-alerts').then(res => res.json()).then(data => setRestockAlert(data)).catch(err => console.error('Failed to load maintenance alerts:', err));
  }, []);
  const acknowledge = async (type, id) => {
    const url = type === 'weather' 
    ? `/api/weather/weather-alerts/${id}/acknowledge`
    : `/api/inventory/restock-alerts/${id}/acknowledge`;
    await fetch(url, {method: 'PATCH'});
    if(type === 'weather'){
        setWeatherAlert(prev => prev.filter(a => a.Alert_ID !== id));
    } else {
        setRestockAlert(prev => prev.filter(a => a.Notification_ID !== id));
    }
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('/api/reports/revenue-summary');
        console.log("📊 Revenue Summary Response:", response.data);
  
        const formattedRevenue = `$${Number(response.data.totalRevenue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  
        setRevenue(formattedRevenue);
      } catch (error) {
        console.error("Error fetching revenue:", error);
        setRevenue('Error loading data');
      }
    };
  
    const fetchTicketsSoldToday = async () => {
      try {
        const response = await axios.get('/api/reports/tickets-today');
        setTicketCount(response.data.total ?? 'N/A');
      } catch (error) {
        console.error("Error fetching tickets sold today:", error);
        setTicketCount('Error');
      }
    };
  
    const fetchVisitorsToday = async () => {
      try {
        const response = await axios.get('/api/reports/visitors-today');
        console.log("Visitor API Response:", response.data);
        const totalVisitors = response.data[0]?.visitors_today;
        setVisitorCount(typeof totalVisitors === 'number' ? totalVisitors : 'N/A');
      } catch (error) {
        console.error("Error fetching daily visitors:", error);
        setVisitorCount('Error');
      }
    };
    const fetchOpenMaintenance = async () => {
        try {
          const res = await axios.get('/api/maintenance/pending');
          setMaintenanceCount(res.data.openCount ?? 'N/A');
        } catch (err) {
          console.error("Error fetching maintenance:", err);
          setMaintenanceCount('Error');
        }
      };
    
      const fetchLatestWeather = async () => {
        try {
          const res = await axios.get('/api/weather/today');
          const { Wtr_cond, temperature } = res.data;
          setCurrentWeather(`${Wtr_cond}, ${temperature}`);
        } catch (err) {
          console.error("Error fetching weather:", err);
          setCurrentWeather('Error');
        }
      };
  
    fetchRevenue();
    fetchTicketsSoldToday();
    fetchVisitorsToday();
    fetchOpenMaintenance();
    fetchLatestWeather();
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);  

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
    fontWeight: 'bold',
    marginTop: '0.5rem',
    textAlign: 'center'
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
    <>
        <div className="alerts-panel">
            <h3>Weather Alerts</h3>
                {Array.isArray(weatherAlert) && weatherAlert.length > 0 ? (weatherAlert.map(alert => (
                    <div className="alert-card" key={alert.Alert_ID}>
                        <p>{alert.Message}</p>
                        <button onClick={() => acknowledge('weather', alert.Alert_ID)}>OK</button>
                    </div>
                ))
            ) : (
                <p>No Weather Alerts</p>
            )}
                <h3>Restock Alerts</h3>
                {Array.isArray(restockAlert) && restockAlert.length > 0 ? (restockAlert.map(alert => (
                    <div className="alert-card" key={alert.Notification_ID}>
                        <p>{alert.Message}</p>
                        <button onClick={() => acknowledge('restock', alert.Notification_ID)}>OK</button>
                    </div>
                ))
            ) : (
                <p>No Restock Alerts</p>
            )}
            </div>

            <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
                🎡 CoogWorld Admin Overview
            </h1>

            {/* Top Cards */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={cardStyle}>
                💰 Total Revenue
                <div style={valueStyle}>{revenue}</div>
                <Link
                    to="/employee-dashboard/revenue-report"
                    style={{ fontSize: '0.9rem', marginTop: '0.5rem', textDecoration: 'underline', color: '#444' }}
                >
                    Click to view full report
                </Link>
                {lastUpdated && (
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem' }}>
                    Last updated at {lastUpdated}
                    </div>
                )}
                </div>
                <div style={cardStyle}>
                🎟️ Tickets Sold Today
                <div style={valueStyle}>{ticketCount}</div>
                </div>
                <div style={cardStyle}>
                📈 Visitors Today
                <div style={valueStyle}>{visitorCount}</div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={cardStyle}>
                🛠️ Open Maintenance Requests
                <div style={valueStyle}>{maintenanceCount}</div>
                </div>
                <div style={cardStyle}>
                🌤️ Current Weather
                <div style={valueStyle}>{currentWeather}°F</div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Home;