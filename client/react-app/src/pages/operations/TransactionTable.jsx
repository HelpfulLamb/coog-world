import React from 'react';
import './Report.css'; 

const TransactionTable = ({ transactions }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((entry, idx) => {
            const fullName = entry.First_name && entry.Last_name
              ? `${entry.First_name} ${entry.Last_name}`
              : 'N/A';
            return (
              <tr key={idx}>
                <td>{fullName}</td>
                <td>{entry.product_type || '—'}</td>
                <td>{entry.quantity_sold}</td>
                <td>${Number(entry.purchase_price || 0).toFixed(2)}</td>
                <td>${Number(entry.total_amount || 0).toFixed(2)}</td>
                <td>{new Date(entry.purchase_created).toISOString().slice(0, 10)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;