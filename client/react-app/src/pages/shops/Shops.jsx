import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shop1Image from '../../images/shop1.webp';
import toyImage from '../../images/shirt1.webp';

function ShopCard({title, description1, button, backgroundImage}){
    return(
        <Link to={button}> 
            <button className='shop-link-card' style={{ backgroundImage: `url(${backgroundImage})` }}>
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
    backgroundImage: PropTypes.string.isRequired,
};

function Shop(){
    const shopOptions = [
        {
            title: 'Park Shops',
            description1: 'Check out what you can find when you visit Coog World!',
            button: "/parkshops",
            backgroundImage: shop1Image
        }, 
        {
            title: 'Merchandise',
            description1: 'See how you can show your Cougar Pride!',
            button: "/merch",
            backgroundImage: toyImage
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
                    backgroundImage={shop.backgroundImage}
                    />
                ))}
            </div>
            
        </>
    )
}

export default Shop;