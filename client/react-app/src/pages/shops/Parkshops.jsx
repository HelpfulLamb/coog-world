import './Shops.css';
import { useEffect, useState } from 'react';
import shopImage from '../../images/shop1.webp'

function ShopCard({title, description1, description2, location}){
    return(
        <>
            <div className='shop-card'>
                <img src={shopImage} alt='shop image' draggable='false' />
                <h3>{title}</h3>
                <p>{description1}</p>
                <p>{description2}</p>
                <p>{location}</p>
            </div>
        </>
    )
}

function Parkshops(){
    const [shopOptions, setShopOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const descriptions = [
        {
            description1: 'Shop info 1',
            description2: 'Shop info 1.1',
        },
        {
            description1: 'Shop info 2',
            description2: 'Shop info 2.1',
        }
    ];

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch('/api/kiosks/shops');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                const shopsWithDesc = data.map((shop, index) => {
                    if(index < descriptions.length){
                        return {...shop, ...descriptions[index]};
                    }
                    return shop;
                });
                setShopOptions(shopsWithDesc);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    if(loading){
        return <></>
    }
    if(error){
        return <div>Error: {error}</div>
    }

    return(
        <>
            <h1 id='shop-title'>Explore the shops of Coog World!</h1>
            <div className='shop-container'>
                {shopOptions.map((shop, index) => (
                    <ShopCard key={index} title={shop.Kiosk_name} description1={shop.description1} description2={shop.description2} location={shop.Kiosk_loc} />
                ))}
            </div>
        </>
    );
}

export default Parkshops;