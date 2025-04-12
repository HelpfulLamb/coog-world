import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';

const RevenueReport = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const [summaryRes, detailsRes] = await Promise.all([
          axios.get('/api/reports/revenue'),
          axios.get('/api/reports/revenue-details')
        ]);
        setRevenueData(summaryRes.data);
        setRawData(detailsRes.data);
      } catch (err) {
        setError('Failed to load revenue data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const toggleFilter = () => setShowFilters(prev => !prev);

  const filteredData = rawData.filter(entry => {
    const entryDate = new Date(entry.purchase_created);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || entryDate >= start) && (!end || entryDate <= end);
  });

  const calcTotal = (type) => {
    return filteredData
      .filter(entry => entry.product_type === type)
      .reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
  };

  const total = filteredData.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  if (loading) return <div>Loading revenue report...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="table-container">
      <h2 style={{ padding: '1rem', color: 'black' }}>💵 Revenue Report</h2>

      <button
        onClick={toggleFilter}
        style={{
          marginBottom: '1rem',
          padding: '0.6rem 1rem',
          backgroundColor: '#c8102e',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {showFilters ? 'Hide Filters' : 'Filter by Dates'}
      </button>

      {showFilters && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>
              📅 From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
            <label>
              📅 To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Total Revenue ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>🎟️ Tickets</td><td>${calcTotal('Ticket').toFixed(2)}</td></tr>
          <tr><td>🛍️ Merchandise</td><td>${calcTotal('Merchandise').toFixed(2)}</td></tr>
          <tr><td>🍔 Food</td><td>${calcTotal('Food').toFixed(2)}</td></tr>
          <tr><td>🛎️ Services</td><td>${calcTotal('Service').toFixed(2)}</td></tr>
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
            <td>Total</td>
            <td>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '2rem' }}>
        <h3>📋 All Transactions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.product_type}</td>
                <td>{entry.quantity_sold}</td>
                <td>${Number(entry.purchase_price || 0).toFixed(2)}</td>
                <td>${Number(entry.total_amount || 0).toFixed(2)}</td>
                <td>{new Date(entry.purchase_created).toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Reports = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>📈 Reports Dashboard</h1>
      <section style={{marginTop: '2rem'}}>
      </section>
      <section style={{marginTop: '2rem'}}>
        <RevenueReport />
      </section>
    </div>
  );
}
export { RevenueReport };
export default Reports;
