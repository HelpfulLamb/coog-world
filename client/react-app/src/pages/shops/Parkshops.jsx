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
                <p>Located in: {location}</p>
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
            description1: 'Visit this Swim Shop for all things water related.',
            description2: 'Clothing and More',
        },
        {
            description1: 'Experience the world of magic with your very own wand.',
            description2: 'Toyshop',
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
            <h1 className='page-titles'>Explore the shops of Coog World!</h1>
            <div className='shop-container'>
                {shopOptions.map((shop, index) => (
                    <ShopCard key={index} title={shop.Kiosk_name} description1={shop.description1} description2={shop.description2} location={shop.area_name} />
                ))}
            </div>
        </>
    );
}

export default Parkshops;