import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketSalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:3305/api/reports/ticket-sales');
        setSalesData(res.data);
      } catch (err) {
        setError('Failed to fetch ticket sales report.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div>Loading ticket sales report...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="table-container">
      <h2 style={{ padding: '1rem', color: 'black' }}>🎟️ Ticket Sales Summary</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ticket Type</th>
            <th>Total Sold</th>
            <th>Monthly Average</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((row, index) => (
            <tr key={index}>
              <td>{row.ticket_type}</td>
              <td>{row.total_sold}</td>
              <td>{row.monthly_avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketSalesReport;