import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionTable from './TransactionTable.jsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#c8102e', '#0088FE', '#00C49F', '#FFBB28'];

const TicketSalesTrends = () => {
  const [trends, setTrends] = useState({ daily: [], weekly: [], monthly: [], yearly: [] });
  const [view, setView] = useState('monthly');
  const [error, setError] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [minSales, setMinSales] = useState(0);
  const [transactionData, setTransactionData] = useState([]);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/reports/revenue-details');
        setTransactionData(res.data || []);
      } catch (err) {
        console.error('Failed to load transactions for trends report');
      }
    };
    fetchTransactions();
  }, []);  

  const filteredTransactions = transactionData.filter(
    (entry) => entry.product_type === 'Ticket'
  );

  const temp = {};
  trends[view]?.forEach(row => {
    if (!temp[row.label]) temp[row.label] = { label: row.label };
    temp[row.label][row.ticket_type] = row.total || 0;
  });
  const transformed = Object.values(temp);
  const uniqueTypes = [...new Set(trends[view]?.map(r => r.ticket_type))];

  const filteredTransformed = transformed.filter(row => {
    if (selectedTicketType) {
      return (row[selectedTicketType] || 0) >= minSales;
    }
    return uniqueTypes.some(type => (row[type] || 0) >= minSales);
  });

  const maxY = Math.max(
    ...filteredTransformed.map(row =>
      selectedTicketType
        ? row[selectedTicketType] || 0
        : Math.max(...uniqueTypes.map(type => row[type] || 0))
    ),
    10
  );

  const handleExportPDF = () => {
    if (filteredTransformed.length === 0) {
      alert("No data to export.");
      return;
    }
  
    const doc = new jsPDF();
    doc.text(`Ticket Sales Report - ${view.toUpperCase()}`, 14, 16);
    autoTable(doc, {
      head: [Object.keys(filteredTransformed[0])],
      body: filteredTransformed.map(obj => Object.values(obj)),
      startY: 24
    });
    doc.save(`ticket_sales_${view}.pdf`);
  };  

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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <label>
          Ticket Type:
          <select value={selectedTicketType} onChange={e => setSelectedTicketType(e.target.value)}>
            <option value="">All</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Min Sales:
          <input
            type="number"
            value={minSales}
            onChange={e => setMinSales(Number(e.target.value))}
            style={{ width: '80px', marginLeft: '0.5rem' }}
          />
        </label>
      </div>

      {/* ✅ PDF Export Button Only */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleExportPDF} className="export-btn">Export PDF</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredTransformed} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} domain={[0, maxY + 10]} />
          <Tooltip />
          <Legend />
          {uniqueTypes.map((type, idx) =>
            !selectedTicketType || selectedTicketType === type ? (
              <Bar key={type} dataKey={type} fill={COLORS[idx % COLORS.length]} />
            ) : null
          )}
        </BarChart>
      </ResponsiveContainer>
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default TicketSalesTrends;