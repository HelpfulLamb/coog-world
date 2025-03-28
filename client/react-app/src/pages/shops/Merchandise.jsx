import './Shops.css';
import { useEffect, useState } from 'react';
import toyImage from '../../images/shirt1.webp';

function MerchCard({title, price, description}){
    return(
        <>
            <div className='merch-card'>
                <img src={toyImage} alt="toy image" draggable='false' />
                <h3>{title}</h3>
                <p>${price}</p>
                <p>{description}</p>
                <button className='fancy'>Add to Cart</button>
            </div>
        </>
    )
}

function Merchandise(){
    const [merchOptions, setMerchOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const response = await fetch('http://localhost/api/inventory/merchandise');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMerchOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMerch();
    }, []);
    if(loading){
        return <></>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1 id='shop-title'>Awaken the Coog Spirit!</h1>
            <div className='merch-container'>
                {merchOptions.map((merch, index) => (
                    <MerchCard key={index} title={merch.Item_name} price={merch.Item_shop_price} description={merch.Item_desc} />
                ))}
            </div>
        </>
    )
}

export default Merchandise;