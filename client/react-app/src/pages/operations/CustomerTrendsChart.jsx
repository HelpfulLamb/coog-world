import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomerTrendsChart = () => {
  const [data, setData] = useState({ daily: [], weekly: [], monthly: [], yearly: [] });
  const [activeView, setActiveView] = useState('daily');

  useEffect(() => {
    axios.get('/api/reports/customer-counts')
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load customer counts:', err));
  }, []);

  const formatData = (raw) =>
    raw.map(row => ({
      label: row.date || row.week || row.month || row.year,
      customers: row.customers
    }));

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ color: '#c8102e' }}>📊 Customer Trends Report</h2>

      <div style={{ marginBottom: '1rem' }}>
        {['daily', 'weekly', 'monthly', 'yearly'].map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              marginRight: '0.5rem',
              padding: '0.4rem 1rem',
              border: activeView === view ? '2px solid #c8102e' : '1px solid #ccc',
              backgroundColor: activeView === view ? '#fff0f3' : '#fff',
              cursor: 'pointer'
            }}
          >
            {view.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formatData(data[activeView])}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="customers" stroke="#c8102e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerTrendsChart;