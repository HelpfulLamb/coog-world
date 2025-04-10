import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';

const GenerateReportButton = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const generateRainoutsReport = async (format) => {
    setIsLoading(true);
    setError(null); 

    try {
      const baseUrl = window.location.origin; 
      const response = await axios.get(`${baseUrl}/api/reports/rainouts?format=${format}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      if (format === 'csv') {
        link.setAttribute('download', 'rainouts_report.csv');
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download the report. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={() => generateRainoutsReport('csv')} disabled={isLoading}>
        {isLoading ? 'Generating Report...' : 'Generate Rainouts CSV Report'}
      </button>
    </div>
  );
};

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
        <GenerateReportButton />
      </section>
      <section style={{marginTop: '2rem'}}>
        <RevenueReport />
      </section>
    </div>
  );
}
export { GenerateReportButton, RevenueReport };
export default Reports;
