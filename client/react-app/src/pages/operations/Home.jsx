import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
  const [revenue, setRevenue] = useState('Loading...');
  const [ticketCount, setTicketCount] = useState('Loading...');
  const [visitorCount, setVisitorCount] = useState('Loading...');
  const [maintenanceCount, setMaintenanceCount] = useState('Loading...');
  const [currentWeather, setCurrentWeather] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState([]);
  const [restockAlert, setRestockAlert] = useState([]);
  const [maintenanceAlert, setMaintenanceAlert] = useState([]);
  const [repairAlert, setRepairAlert] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();

  useEffect(() => {
    const hasShownAlerts = { weather: false, restock: false, maintenance: false, repair: false };

    const fetchAndShowAlerts = async () => {
      if (hasShownAlerts.weather) return;

      const weatherRes = await fetch('/api/weather/weather-alerts');
      const weatherData = await weatherRes.json();
      setWeatherAlert(weatherData);
      weatherData.forEach(alert => {
        toast.custom((t) => (
          (role === 'admin') && (
            <div style={{
              background: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '260px',
            }}>
              <strong>🌩️ Weather Alert</strong>
              <div>{alert.Message}</div>
              <button
                style={{
                  alignSelf: 'flex-end',
                  background: '#c8102e',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  acknowledge('weather', alert.Alert_ID);
                  toast.dismiss(t.id);
                }}
              >
                OK
              </button>
            </div>
          )
        ));
      });
      hasShownAlerts.weather = true;

      if (hasShownAlerts.restock) return;

      const restockRes = await fetch('/api/inventory/restock-alerts');
      const restockData = await restockRes.json();
      setRestockAlert(restockData);
      restockData.forEach(alert => {
        toast.custom((t) => (
          (role === 'admin' || role === 'manager') && (
            <div style={{
              background: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '260px',
            }}>
              <strong>📦 Restock Alert</strong>
              <div>{alert.Message}</div>
              <button
                style={{
                  alignSelf: 'flex-end',
                  background: '#c8102e',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}

                onClick={() => {
                  acknowledge('restock', alert.Notification_ID);
                  toast.dismiss(t.id);
                }}
              >
                OK
              </button>
            </div>
          )
        ));
      });
      hasShownAlerts.restock = true;

      if(hasShownAlerts.maintenance) return;
      const maintenanceRes = await fetch('/api/maintenance/maintenance-alerts');
      const maintenanceData = await maintenanceRes.json();
      setMaintenanceAlert(maintenanceData);
      maintenanceData.forEach(alert => {
        toast.custom((t) => (
            (role === 'admin') && (
                <div style={{
                    background: '#fff',
                    padding: '1rem 1.5rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    color: '#333',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    minWidth: '260px',
                }}>
                  <strong>🛠 Maintenance Alert</strong>
                  <div>{alert.Message}</div>
                  <button style={{
                  alignSelf: 'flex-end',
                  background: '#c8102e',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                    acknowledge('maintenance', alert.Alert_ID);
                    toast.dismiss(t.id);
                  }}>
                    OK
                  </button>
                </div>
            )
        ));
      });
      hasShownAlerts.maintenance = true;

      if(hasShownAlerts.repair) return;
      const repairRes = await fetch('/api/maintenance/repair-alerts');
      const repairData = await repairRes.json();
      setRepairAlert(repairData);
      repairData.forEach(alert => {
        toast.custom((t) => (
            (role === 'admin') && (
                <div style={{
                    background: '#fff',
                    padding: '1rem 1.5rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    color: '#333',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    minWidth: '260px',
                }}>
                  <strong>🛠 Maintenance Alert</strong>
                  <div>{alert.message}</div>
                  <button style={{
                  alignSelf: 'flex-end',
                  background: '#c8102e',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                    acknowledge('repair', alert.log_id);
                    toast.dismiss(t.id);
                  }}>
                    OK
                  </button>
                </div>
            )
        ));
      });
    };
    fetchAndShowAlerts();
  }, []);
  const acknowledge = async (type, id) => {
    const url = type === 'weather'
      ? `/api/weather/weather-alerts/${id}/acknowledge`
      : type === 'maintenance'
      ? `/api/maintenance/maintenance-alerts/${id}/acknowledge`
      : type === 'repair'
      ? `/api/maintenance/repair-alerts/${id}/acknowledge`
      : `/api/inventory/restock-alerts/${id}/acknowledge`;
    await fetch(url, { method: 'PATCH' });
    if (type === 'weather') {
      setWeatherAlert(prev => prev.filter(a => a.Alert_ID !== id));
    } else if(type === 'restock') {
      setRestockAlert(prev => prev.filter(a => a.Notification_ID !== id));
    } else if(type === 'maintenance'){
        setMaintenanceAlert(prev => prev.filter(a => a.Alert_ID !== id));
    } else if(type === 'repair'){
        setRepairAlert(prev => prev.filter(a => a.log_id !== id));
    }
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('/api/reports/revenue-summary');
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

  return (
    <>
      <div style={{ padding: '2rem', color: 'white' }}>
        {role === 'admin' && (
          <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
            🎡 CoogWorld Admin Overview
          </h1>
        )}
        {role === 'manager' && (
          <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
            🎡 CoogWorld Manager Overview
          </h1>
        )}
        {role === 'maintenance' && (
          <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
            🎡 CoogWorld Maintenance Overview
          </h1>
        )}
        {(role !== 'admin' && role !== 'manager' && role !== 'maintenance') && (
          <h1 style={{ color: '#c8102e', marginBottom: '2rem', fontSize: '2.5rem' }}>
            🎡 CoogWorld Employee Overview
          </h1>
        )}
        {(role === 'admin' || role === 'manager') && (
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {role === 'admin' && (
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
            )}

            <div style={cardStyle}>
              🎟️ Tickets Sold Today
              <div style={valueStyle}>{ticketCount}</div>
            </div>
            <div style={cardStyle}>
              📈 Visitors Today
              <div style={valueStyle}>{visitorCount}</div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          {(role === 'admin' || role === 'maintenance') && (
            <div style={cardStyle}>
              🛠️ Open Maintenance Requests
              <div style={valueStyle}>{maintenanceCount}</div>
            </div>
          )}
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