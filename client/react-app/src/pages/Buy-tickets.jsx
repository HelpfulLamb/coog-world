import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function TicketCard({ title, price, description1, description2, ticketId }) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [visitDate, setVisitDate] = useState('');
    const { addToCart } = useCart();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;

    const handleAddToCart = async () => {
        if (!userId) {
            toast.error('Please log in to purchase tickets.', {
                duration: 3000,
                position: 'top-center'
            });
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        if (!visitDate) {
            toast.error('Please select a visit date.', {
                duration: 3000,
                position: 'top-center'
            });
            return;
        }

        const toastId = toast.loading('Adding ticket to cart...');

        try {
            const response = await fetch('/api/cart/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Visitor_ID: userId,
                    Product_Type: 'Ticket',
                    Product_ID: ticketId,
                    Product_Name: title,
                    Visit_Date: visitDate,
                    Quantity: parseInt(quantity),
                    Price: Number(parseFloat(price).toFixed(2))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            addToCart({
                type: 'ticket',
                ticketId,
                title,
                price,
                quantity: parseInt(quantity),
                visitDate,
            });

            toast.success('✅ Ticket added to cart!', {
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

    const today = new Date();
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className='price-card'>
            <h3>{title}</h3>
            <h2>${price}</h2>
            <ul>
                <li>{description1}</li>
                <li>{description2}</li>
            </ul>

            <div style={{ marginBottom: '10px' }}>
                <label>Quantity: </label>
                <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                    {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Visit Date: </label>
                <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                    required
                    min={minDate}
                />
            </div>

            <div><strong>Total: ${(price * quantity).toFixed(2)}</strong></div>

            <button className='fancy' onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

function ParkingCard({ title, price, description1, description2, ticketId }) {
    const { user } = useAuth();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || storedUser?.id || storedUser?.Visitor_ID;
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [visitDate, setVisitDate] = useState('');

    const handleAddParking = async () => {
        if (!userId || !ticketId) {
            toast.error('Please log in to add a parking pass.', {
                duration: 3000,
                position: 'top-center'
            });
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        if (!visitDate) {
            toast.error('Please select a visit date for the parking pass.', {
                duration: 3000,
                position: 'top-center'
            });
            return;
        }

        const toastId = toast.loading('Adding parking pass to cart...');

        try {
            const response = await fetch('/api/cart/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Visitor_ID: userId,
                    Product_Type: 'Ticket',
                    Product_ID: ticketId,
                    Product_Name: title,
                    Visit_Date: visitDate,
                    Quantity: 1,
                    Price: Number(parseFloat(price).toFixed(2))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            addToCart({
                type: 'ticket',
                ticketId,
                title,
                price,
                quantity: 1,
                visitDate
            });

            toast.success('✅ Parking pass added to cart!', {
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

    const today = new Date();
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className='price-card parking-card'>
            <h3>{title}</h3>
            <h2>+${price}</h2>
            <ul>
                <li>{description1}</li>
                <li>{description2}</li>
            </ul>
            <div style={{ marginBottom: '10px' }}>
                <label>Visit Date: </label>
                <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                    required
                    min={minDate}
                />
            </div>
            <button className='fancy' onClick={handleAddParking}>Add Parking</button>
        </div>
    );
}

function Tickets() {
    const [ticketOptions, setTicketOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const descriptions = [
        {
            description1: 'Allows access to the themepark.',
            description2: 'Date-based ticket that requires you to choose a start date.'
        },
        {
            description1: 'Includes General Admission plus VIP lounge access.',
            description2: 'Date-based ticket with priority access to rides.'
        },
        {
            description1: 'Unlimited visits for the entire season.',
            description2: 'Includes discounts on food and merchandise.'
        },
        {
            description1: 'Optional parking pass for your vehicle.',
            description2: 'Includes all day parking.'
        }
    ];

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('/api/ticket-type');
                const ticketsWithDesc = response.data.map((ticket, index) => {
                    if (index < descriptions.length) {
                        return { ...ticket, ...descriptions[index] };
                    }
                    return ticket;
                });
                setTicketOptions(ticketsWithDesc);
            } catch (error) {
                setError(error.message);
                toast.error(`Failed to load tickets: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) return null;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1 className='page-titles'>Our Pricing Plan</h1>
            <div className='price-container'>
                {ticketOptions.slice(0, 3).map((ticket) => (
                    <TicketCard
                        key={ticket.ticket_id}
                        title={ticket.ticket_type}
                        price={ticket.price}
                        description1={ticket.description1}
                        description2={ticket.description2}
                        ticketId={ticket.ticket_id}
                    />
                ))}
            </div>
            <div className='price-container'>
                {ticketOptions.length > 3 && (
                    <ParkingCard
                        title={ticketOptions[3].ticket_type}
                        price={ticketOptions[3].price}
                        description1={ticketOptions[3].description1}
                        description2={ticketOptions[3].description2}
                        ticketId={ticketOptions[3].ticket_id}
                    />
                )}
            </div>
        </>
    );
}

export default Tickets;