import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiration: '',
    cvv: '',
    zip: '',
    billingAddress: ''
  });

  const onlyTickets = cartItems.every(item => item.type === 'ticket');
const hasMerch = cartItems.some(item => item.type === 'merch');

useEffect(() => {
  if (onlyTickets) {
    setPaymentMethod('');
  } else if (hasMerch) {
    setPaymentMethod('card');
  }
}, [onlyTickets, hasMerch]);


  const handleCheckout = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;

    if (!userId) {
      alert("Please log in to complete checkout.");
      navigate("/login");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.billingAddress)) {
      alert("Please fill in card number and billing address.");
      return;
    }
    if (paymentMethod === 'pay_at_store') {

      if (hasMerch) {
        alert("Pay at Store is only allowed for ticket purchases. Please switch to Credit/Debit Card.");
        return;
      }
    }
    

    try {
      for (const item of cartItems) {
        if (item.ticketId) {
          await axios.post("/api/ticket-type/purchase", {
            user_id: userId,
            ticket_id: item.ticketId,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
            visit_date: item.visitDate,
            payment_method: paymentMethod,
            card_info: paymentMethod === 'card' ? cardDetails : null,
          });
        } else if (item.type === "merch") {
          await axios.post("/api/inventory/purchase", {
            user_id: userId,
            item_id: item.itemId,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
            product_type: 'Merchandise',
            payment_method: paymentMethod,
            card_info: paymentMethod === 'card' ? cardDetails : null,
          });
        }
      }

      alert("🎉 Checkout complete!");
      clearCart();
      navigate("/profile");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout.");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">🛒 Your cart is currently empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, idx) => (
              <div key={idx} className="cart-item">
                <div className="cart-header">
                  <span className="cart-title">{item.title}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(idx)}>
                    ❌
                  </button>
                </div>
                {item.visitDate && (
                  <p className="cart-visit-date">
                    <strong>Visit Date:</strong> {new Date(item.visitDate + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
                <div className="cart-details">
                  <p>${Number(item.price).toFixed(2)} x </p>
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(idx, parseInt(e.target.value))}
                    className="quantity-select"
                  >
                    {[...Array(10).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                  <span>= ${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-section">
            <label htmlFor="payment-method">Payment Method:</label>
            <select
  id="payment-method"
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="">-- Select Payment --</option>
  {onlyTickets && <option value="pay_at_store">Pay at Store (Tickets Only)</option>}
  <option value="card">Credit / Debit Card</option>
</select>


            {paymentMethod === 'card' && (
              <div className="card-form">
                <label>Card Number:</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                />

                <label>Expiration Date:</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiration}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiration: e.target.value })}
                />

                <label>CVV:</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />

                <label>ZIP Code:</label>
                <input
                  type="text"
                  placeholder="77004"
                  value={cardDetails.zip}
                  onChange={(e) => setCardDetails({ ...cardDetails, zip: e.target.value })}
                />

                <label>Billing Address:</label>
                <input
                  type="text"
                  placeholder="123 Main St"
                  value={cardDetails.billingAddress}
                  onChange={(e) => setCardDetails({ ...cardDetails, billingAddress: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="cart-footer">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <div className="cart-actions">
              <button className="checkout-btn" onClick={handleCheckout}>
                ✅ Complete Checkout
              </button>
              <button className="clear-btn" onClick={clearCart}>
                🗑 Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;