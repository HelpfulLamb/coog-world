import React from 'react';

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <h3 style={{ color: 'black' }}>{message}</h3>
        <div className="confirmation-modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
