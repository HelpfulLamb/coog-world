import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiration: '',
    cvv: '',
    zip: '',
    billingAddress: ''
  });
  const [isProcessing, setIsProcessing] = useState(false); 
  const [taxRate, setTaxRate] = useState(0.0825);
  const [taxAmount, setTaxAmount] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  const onlyTickets = cartItems.every(item => item.type === 'ticket');
  const hasMerch = cartItems.some(item => item.type === 'merch');
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  useEffect(() => {
    if (onlyTickets) {
      setPaymentMethod('');
    } else if (hasMerch) {
      setPaymentMethod('card');
    }
  }, [onlyTickets, hasMerch]);

  useEffect(() => {
    const taxableAmount = cartItems.reduce((acc, item) => {
        return acc + (item.type === 'merch' ? Number(item.price) * item.quantity : 0);
    }, 0);
    const calculatedTax = taxableAmount * taxRate;
    const calculatedTotal = subtotal + calculatedTax;
    setTaxAmount(calculatedTax);
    setOrderTotal(calculatedTotal);
  }, [cartItems, taxRate, subtotal]);

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
    if (paymentMethod === 'pay_at_store' && hasMerch) { 
      alert("Pay at Store is only allowed for ticket purchases. Please switch to Credit/Debit Card.");
      return;
    }
    setIsProcessing(true); 
    try {
      for (const item of cartItems) {
        let endpoint = '';
        let bodyData = {};
        if (item.ticketId) {
            endpoint = '/api/ticket-type/purchase';
            bodyData = {
                user_id: userId,
                ticket_id: item.ticketId,
                price: item.price,
                quantity: item.quantity,
                total_amount: item.price * item.quantity,
                visit_date: item.visitDate,
                payment_method: paymentMethod,
            };
        } else if (item.type === "merch") {
            if(!item.inventoryId){
                console.error('missing information: ', item);
                setIsProcessing(false);
                return;
            }
            endpoint = '/api/inventory/purchase';
            const subtotal = Number(item.price) * item.quantity;
            const itemTax = subtotal * taxRate;
            const total = subtotal + itemTax;
            bodyData = {
                user_id: userId,
                item_id: item.inventoryId,

                price: item.price,
                quantity_sold: item.quantity,
                quantity: item.quantity,
                total_amount: total,
                product_type: 'Merchandise',
                payment_method: paymentMethod,
            };
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        });
        const result = await response.json();
        if(!response.ok){
            console.error(`Error from ${endpoint}:`, result);
            throw new Error(result.message || 'Purchase failed');
        }
      }
      setConfirmedOrder({
        orderNumber: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        items: cartItems,
        subtotal: subtotal,
        tax: taxAmount,
        total: orderTotal,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'Pay at Store',
        lastFour: paymentMethod === 'card' ? cardDetails.cardNumber.slice(-4) : null
      });
      setShowConfirmation(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
      clearCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formattedValue });
  };
  return (
    <div className='checkout-page'>
        {showConfirmation && confirmedOrder && (
            <div className='confirmation-overlay'>
                <h2>✅ Order Confirmed</h2>
                <p>Thank you for your purchase!</p>
                <div className='order-summary-box'>
                    <p><strong>Order #: </strong>{confirmedOrder.orderNumber}</p>
                    <p><strong>Date: </strong>{confirmedOrder.date}</p>
                    <p><strong>Payment: </strong>{confirmedOrder.paymentMethod}{confirmedOrder.lastFour && `**** ${confirmedOrder.lastFour}`}</p>
                    <hr />
                    <ul>
                        {confirmedOrder.items.map((item, index) => (
                            <li key={index}>{item.title} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</li>
                        ))}
                    </ul>
                    <hr />
                    <p><strong>Subtotal: </strong>${confirmedOrder.subtotal.toFixed(2)}</p>
                    <p><strong>Tax: </strong>${confirmedOrder.tax.toFixed(2)}</p>
                    <p><strong>Total: </strong>{confirmedOrder.total.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                </div>
                <div className='confirmation-actions'>
                    <button className='continue-btn' onClick={() => navigate('/profile')}>View Profile</button>
                    <button className='continue-btn outline' onClick={() => navigate('/')}>Back to Home</button>
                </div>
            </div>
        )}
        <div className="checkout-container">
            {!showConfirmation && (
                <div className="checkout-header">
                    <h1>Checkout</h1>
                </div>
            )}
            {!showConfirmation && (
                <div className="checkout-layout">
                    <div className="order-summary">
                        <h2 className="section-title">Order Summary</h2>
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-cart-icon">🛒</div>
                                <p>Your cart is currently empty.</p>
                                <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>Continue Shopping</button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cartItems.map((item, idx) => (
                                    <div key={idx} className="cart-item">
                                        <div className="item-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} />
                                            ) : (
                                                <div className="image-placeholder">
                                                {item.type === 'ticket' ? '🎟️' : '🛍️'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <div className="item-header">
                                                <h3 className="item-title">{item.title}</h3>
                                                <button className="remove-btn" onClick={() => removeFromCart(idx)} aria-label="Remove item">×</button>
                                            </div>
                                            {item.visitDate && (
                                                <div className="item-date">
                                                    <span>Visit Date: </span>
                                                    {new Date(item.visitDate + 'T00:00:00').toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            )}
                                            <div className="item-footer">
                                                <div className="quantity-selector">
                                                    <label>Qty:</label>
                                                    <select value={item.quantity} onChange={(e) => updateQuantity(idx, parseInt(e.target.value))}>
                                                        {[...Array(10).keys()].map((n) => (
                                                        <option key={n + 1} value={n + 1}>
                                                            {n + 1}
                                                        </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="item-price">
                                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                <div className="order-totals">
                                    <div className="total-row">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Tax ({taxRate * 100}%)</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="total-row grand-total">
                                        <span>Total</span>
                                        <span>${orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                    <div className="payment-section">
                        <h2 className="section-title">Payment Information</h2>
                        <div className="payment-methods">
                            <h3>Select Payment Method</h3>
                            <div className="method-options">
                                {onlyTickets && (
                                <label className={`method-option ${paymentMethod === 'pay_at_store' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="pay_at_store" checked={paymentMethod === 'pay_at_store'} onChange={() => setPaymentMethod('pay_at_store')} />
                                    <div className="method-content">
                                        <span className="method-icon">🏪</span>
                                        <span className="method-name">Pay at Store</span>
                                        <span className="method-description">Pay when you arrive (Tickets only)</span>
                                    </div>
                                </label>
                                )}
                                <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <div className="method-content">
                                        <span className="method-icon">💳</span>
                                        <span className="method-name">Credit/Debit Card</span>
                                        <span className="method-description">Visa, Mastercard, Amex, Discover</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {paymentMethod === 'card' && (
                        <div className="card-form">
                            <div className="form-group">
                                <label>Card Number</label>
                                <input type="text" placeholder="1234 5678 9012 3456" value={cardDetails.cardNumber} onChange={handleCardNumberChange} maxLength="19" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiration Date</label>
                                    <input type="text" placeholder="MM/YY" value={cardDetails.expiration} onChange={(e) => setCardDetails({ ...cardDetails, expiration: e.target.value })} maxLength="5" />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input type="text" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} maxLength="4" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Billing Address</label>
                                <input type="text" placeholder="123 Main St, City, State" value={cardDetails.billingAddress} onChange={(e) => setCardDetails({ ...cardDetails, billingAddress: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input type="text" placeholder="77004" value={cardDetails.zip} onChange={(e) => setCardDetails({ ...cardDetails, zip: e.target.value })} maxLength="10" />
                                </div>
                            </div>
                        </div>
                        )}
                        <div className="checkout-actions">
                            <button className="checkout-btn" onClick={handleCheckout} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                            </button>
                            <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                            <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>Continue Shopping</button>
                        </div>
                        <div className="security-info">
                            <div className="secure-payment">
                                <span className="lock-icon">🔒</span>
                                <span>Secure Payment</span>
                            </div>
                            <div className="payment-icons">
                                <span>Visa</span>
                                <span>Mastercard</span>
                                <span>Amex</span>
                                <span>Discover</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}
        </div>
    </div>
  );
}

export default Cart;