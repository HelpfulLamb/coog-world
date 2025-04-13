import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#c8102e', '#0088FE', '#00C49F', '#FFBB28'];

const TicketSalesTrends = () => {
  const [trends, setTrends] = useState({ daily: [], weekly: [], monthly: [], yearly: [] });
  const [view, setView] = useState('monthly'); // default view
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get('/api/reports/ticket-sales-trends');
        setTrends(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch ticket sales trends.');
      }
    };
    fetchTrends();
  }, []);

  const transformed = [];
  const temp = {};

  trends[view]?.forEach(row => {
    if (!temp[row.label]) {
      temp[row.label] = { label: row.label };
    }
    temp[row.label][row.ticket_type] = row.total || 0; // Ensure no undefined values
  });

  for (let key in temp) {
    transformed.push(temp[key]);
  }

  const uniqueTypes = [...new Set(trends[view]?.map(r => r.ticket_type))];
  // Get max Y value from all bars
const maxY = Math.max(
  ...transformed.map(row =>
    uniqueTypes.reduce((sum, type) => Math.max(sum, row[type] || 0), 0)
  )
);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ padding: '1rem', color: '#c8102e', fontWeight: 'bold' }}>
        📊 Ticket Sales Trends ({view.toUpperCase()})
      </h2>
  
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        {['daily', 'weekly', 'monthly', 'yearly'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: view === v ? '#c8102e' : '#eee',
              color: view === v ? 'white' : 'black',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>
  
      {error && <p style={{ color: 'red' }}>{error}</p>}
        
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformed} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} domain={[0, maxY + 10]} />

          <Tooltip />
          <Legend />
          {uniqueTypes.map((type, idx) => (
            <Bar key={type} dataKey={type} fill={COLORS[idx % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );  
};

export default TicketSalesTrends;