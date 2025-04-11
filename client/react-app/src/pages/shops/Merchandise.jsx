import './Shops.css';
import { useEffect, useState } from 'react';
import shirtImage from '../../images/shirt1.webp';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function MerchCard({ title, price, description, itemId, quantity }) {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;

    const handleAddToCart = () => {
        if (!userId) {
            alert("Please log in to add items.");
            return;
        }

        console.log("🛒 Adding to cart:", { title, price, itemId });  // ✅ Confirm it shows a number

        addToCart({
            type: 'merch',
            title,
            price,
            quantity: 1,
            itemId,  // ✅ This must be defined
        });

        alert("🛍️ Item added to cart!");
    };

    return (
        <div className='merch-card'>
            <img src={shirtImage} alt="shirt image" draggable='false' />
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
                    itemId={merch.Inventory_ID}
                    quantity={merch.Item_quantity}
                  />                  
                  
                ))}
            </div>
        </>
    );
}

export default Merchandise;
