import { useState, useEffect } from "react";
import AddTicket from "../modals/AddTicket";

function TicketTable({ticketInformation, setIsModalOpen}){
    if(!ticketInformation || !Array.isArray(ticketInformation)){
        return <div>No ticket data is available.</div>
    }
    return(
        <>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ticket Type</th>
                            <th>Price</th>
                            <th>Monthly Avg</th>
                            <th>Total Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketInformation.map((ticket) => (
                            <tr key={ticket.ticket_id}>
                                <td>{ticket.ticket_type}</td>
                                <td>${ticket.price}</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ticket</button>
                </div>
            </div>
        </>
    );
}

function TicketReport(){
    const [ticketInformation, setTicketInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('/api/ticket-type/info');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Fetched tickets:', data);
    
                setTicketInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTickets();
    }, []);    
    const handleAddTicket = (newTicket) => {
        setTicketInformation([...ticketInformation, newTicket]);
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Coog World Tickets</h1>
            <TicketTable ticketInformation={ticketInformation} setIsModalOpen={setIsModalOpen} />
            <AddTicket isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTicket={handleAddTicket} />
        </>
    )
}

export default TicketReport;