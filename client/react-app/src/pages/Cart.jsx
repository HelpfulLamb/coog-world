import React from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;

    if (!userId) {
      alert("Please log in to complete checkout.");
      navigate("/login");
      return;
    }

    try {
      for (const item of cartItems) {
        console.log("📦 Checkout item:", item);

        if (item.ticketId) {
          await axios.post("/api/ticket-type/purchase", {
            user_id: userId,
            ticket_id: item.ticketId,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
            visit_date: item.visitDate,
          });
        } else if (item.type === "merch") {
          if (!item.itemId) {
            throw new Error("Missing itemId for merch item");
          }

          await axios.post("/api/inventory/purchase", {
            user_id: userId,
            item_id: item.itemId,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
            product_type: 'Merchandise'
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
                🎟️ <strong>{item.title}</strong> — ${item.price} ×{" "}
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(idx, parseInt(e.target.value))
                  }
                  style={{ margin: '0 10px', padding: '4px' }}
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
                = ${(item.price * item.quantity).toFixed(2)}
                <button
                  onClick={() => removeFromCart(idx)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  ❌ Remove
                </button>
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
