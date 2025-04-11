import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';


const RevenueReport = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get('http://localhost:3305/api/reports/revenue');
        setRevenueData(res.data);
      } catch (err) {
        setError('Failed to load revenue data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <div>Loading revenue report...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="table-container">
      <h2 style={{ padding: '1rem', color: 'black' }}>💵 Breakdown by Type:</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Total Revenue ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🎟️ Tickets</td>
            <td>${parseFloat(revenueData.ticketRevenue || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>🛍️ Merchandise</td>
            <td>${parseFloat(revenueData.merchRevenue || 0).toFixed(2)}</td>
          </tr>
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
            <td>Total</td>
            <td>${parseFloat(revenueData.totalRevenue || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
const Reports = () => {
  return(
    <div style={{padding: '2rem'}}>
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
