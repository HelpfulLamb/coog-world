import React from 'react';
import './Report.css'; 

const TransactionTable = ({ transactions }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Ticket Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.ticket_type || '—'}</td>
              <td>{entry.quantity_sold}</td>
              <td>${Number(entry.purchase_price || 0).toFixed(2)}</td>
              <td>${Number(entry.total_amount || 0).toFixed(2)}</td>
              <td>{new Date(entry.purchase_created).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable; 
