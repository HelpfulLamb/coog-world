import './Shops.css';
import React, { useEffect, useState } from 'react';
import shirtImage from '../../images/shirt1.webp';
import magnetImage from '../../images/magnet.png';
import sunglassesImage from '../../images/sunglasses.png';
import pencilImage from '../../images/pencil.jpg';
import plushImage from '../../images/plush.jpeg';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function MerchCard({ title, price, description, inventoryId, quantity, itemId }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
  
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;

    const handleAddToCart = async () => {
      if (!userId) {
        toast.error('Please log in to purchase items.', {
          duration: 3000,
          position: 'top-center'
        });
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      if (quantity === 0) {
        toast.error('This item is out of stock.', {
          duration: 3000,
          position: 'top-center'
        });
        return;
      }

      const toastId = toast.loading('Adding item to cart...');

      try {
        const response = await fetch('/api/cart/add-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Visitor_ID: userId,
            Product_Type: 'Item',
            Product_ID: itemId,
            Product_Name: title,
            Visit_Date: null,
            Quantity: 1, 
            Price: Number(parseFloat(price).toFixed(2))
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
    
        addToCart({
          type: 'merch',
          title,
          price,
          quantity: 1,
          itemId,
          inventoryId,
        });
    
        toast.success('✅ Item added to cart!', {
          id: toastId,
          duration: 3000,
          position: 'top-center'
        });
    
      } catch (error) {
        console.error("Cart error:", error);
        toast.error('❌ Failed to add item. Please try again.', {
          id: toastId,
          duration: 4000,
          position: 'top-center'
        });
      }
    };
  
    const getImageForTitle = (title) => {
      if (title.toLowerCase().includes("magnet")) return magnetImage;
      if (title.toLowerCase().includes("pencil")) return pencilImage;
      if (title.toLowerCase().includes("sunglasses")) return sunglassesImage;
      if (title.toLowerCase().includes("plush")) return plushImage;
      return shirtImage;
    };
  
    const merchImage = getImageForTitle(title);
  
    return (
      <div className='merch-card'>
        <img src={merchImage} alt={title} draggable='false' />
        <h3>{title}</h3>
        <p>${price}</p>
        <p>{description}</p>
        {quantity === 0 ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</p>
        ) : (
          <button
            className='fancy'
            onClick={handleAddToCart}
            disabled={quantity === 0}
            style={{
              backgroundColor: quantity === 0 ? '#ccc' : '',
              cursor: quantity === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    );
}

function Merchandise() {
    const [merchOptions, setMerchOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const response = await fetch('/api/inventory/merchandise');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMerchOptions(data);
            } catch (error) {
                setError(error.message);
                toast.error(`Failed to load merchandise: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchMerch();
    }, []);

    if (loading) return <></>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1 className='page-titles'>Awaken the Coog World love!</h1>
            <div className='merch-container'>
                {merchOptions.map((merch, index) => (
                    <MerchCard
                        key={merch.Inventory_ID}
                        title={merch.Item_name}
                        price={merch.Item_shop_price}
                        description={merch.Item_desc}
                        itemId={merch.Item_ID}
                        inventoryId={merch.Inventory_ID}
                        quantity={merch.Item_quantity}
                        imageFileName={merch.Image || 'magnet.png'}
                    />                  
                ))}
            </div>
        </>
    );
}

export default Merchandise;