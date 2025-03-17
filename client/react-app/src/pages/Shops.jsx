import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ShopCard({title, description1, button}){
    return(
        <Link to={button}> 
            <button className='shop-link-card'>
                <div className='shop-link-text'>
                    <h2>{title}</h2>
                    <h3>{description1}</h3>
                </div>
            </button>
        </Link>
    )
}

ShopCard.propTypes = {
    title: PropTypes.string.isRequired,
    description1: PropTypes.string.isRequired,
    button: PropTypes.element.isRequired,
};

function Shop(){
    const shopOptions = [
        {
            title: 'Park Shops',
            description1: 'Check out what you can find when you visit Coog World!',
            button: "/parkshops"
        }, 
        {
            title: 'Merchandise',
            description1: 'See how you can show your Cougar Pride!',
            button: "/merch"
        },
    ];
    return(
        <>
            <h1 id='shop-title'>See what stories you can tell in Coog World!</h1>
            <div className='shop-link-container'>
                {shopOptions.map((shop, index) =>(
                    <ShopCard 
                    key={index}
                    title={shop.title}
                    description1={shop.description1}
                    button={shop.button}
                    />
                ))}
            </div>
            
        </>
    )
}

export default Shop;