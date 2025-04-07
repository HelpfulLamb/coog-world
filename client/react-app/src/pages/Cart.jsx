import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user || !user.id) {
      alert("Please log in to complete checkout.");
      navigate("/login");
      return;
    }

    try {
      // Loop through each cart item and make a POST request
      for (const item of cartItems) {
        await axios.post("/api/ticket-type/purchase", {
          user_id: user.id,
          ticket_id: item.ticketId,
          price: item.price,
          quantity: item.quantity,
          total_amount: item.price * item.quantity // ✅ include this if backend supports it
        });
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
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, idx) => (
              <li key={idx}>
                🎟️ {item.title} — ${item.price} × {item.quantity} = ${(
                  item.price * item.quantity
                ).toFixed(2)}
              </li>
            ))}
          </ul>

          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button className="fancy" onClick={handleCheckout}>
            ✅ Complete Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;