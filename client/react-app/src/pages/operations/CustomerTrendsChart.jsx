import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';


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
    const currentData = formatData(data[activeView]);
    const maxY = Math.max(...currentData.map(d => d.customers), 10); // fallback to 10 if empty
    const paddedMaxY = Math.ceil((maxY + 5) / 5) * 5; // round up to next multiple of 5
    
  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ color: '#c8102e', fontWeight: 'bold', marginBottom: '1rem' }}>
        📊 Customer Trends Report
      </h2>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        {['daily', 'weekly', 'monthly', 'yearly'].map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: activeView === view ? '2px solid #c8102e' : '1px solid #ccc',
              backgroundColor: activeView === view ? '#ffe5ea' : '#f9f9f9',
              color: '#333',
              fontWeight: activeView === view ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {view.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={formatData(data[activeView])}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, paddedMaxY]} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderColor: '#c8102e' }}
            labelStyle={{ color: '#c8102e', fontWeight: 'bold' }}
            itemStyle={{ color: '#222' }}
          />
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="customers" stroke="#c8102e" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerTrendsChart;