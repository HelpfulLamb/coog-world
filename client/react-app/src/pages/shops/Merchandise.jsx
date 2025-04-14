import './Shops.css';
import { useEffect, useState } from 'react';
import shirtImage from '../../images/shirt1.webp';
import magnetImage from '../../images/magnet.png';
import pencilImage from '../../images/pencil.jpg';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function MerchCard({ title, price, description, inventoryId, quantity, itemId }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
  
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;
  
    const handleAddToCart = () => {
      if (!userId) {
        alert("Please log in to add items.");
        return;
      }
  
      console.log("🛒 Adding to cart:", { title, price, itemId });
  
      addToCart({
        type: 'merch',
        title,
        price,
        quantity: 1,
        itemId,
        inventoryId,
      });
  
      alert("🛍️ Item added to cart!");
    };
  
    // 👇 Select image based on item name
    const getImageForTitle = (title) => {
      if (title.toLowerCase().includes("magnet")) return magnetImage;
      if (title.toLowerCase().includes("pencil")) return pencilImage;
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
                console.log("🧾 Available merch:", data);
                setMerchOptions(data);
            } catch (error) {
                setError(error.message);
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
