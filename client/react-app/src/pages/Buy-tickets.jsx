import PropTypes from 'prop-types';

function TicketCard({title, price, description1, description2}){
    return(
        <div className='price-card'>
            <h3>{title}</h3>
            <h2>{price}</h2>
            <p>{description1}</p>
            <p>{description2}</p>
            <button className='fancy'>Purchase</button>
        </div>
    )
}

TicketCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description1: PropTypes.string.isRequired,
    description2: PropTypes.string.isRequired,
};

function Tickets(){
    const ticketOptions = [
        {
            title: 'General Admission',
            price: '$50',
            description1: 'Allows access to the themepark.',
            description2: 'Date-based ticket that requires you to choose a start date.'
        }, 
        {
            title: 'VIP Pass',
            price: '$120',
            description1: 'Includes General Admission plus VIP lounge access.',
            description2: 'Date-based ticket with priority access to rides.'
        },
        {
            title: 'Season Pass',
            price: '$300',
            description1: 'Unlimited visits for the entire season.',
            description2: 'Includes discounts on food and merchandise.'
        }
    ];
    return(
        <>
            <h1 id='tickets-title'>Our Pricing Plan</h1>
            <div className='price-container'>
                {ticketOptions.map((ticket, index) =>(
                    <TicketCard 
                    key={index}
                    title={ticket.title}
                    price={ticket.price}
                    description1={ticket.description1}
                    description2={ticket.description2}
                    />
                ))}
            </div>
        </>
    )
}

export default Tickets;