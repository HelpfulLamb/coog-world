import { useState, useEffect } from "react";
import AddTicket, {UpdateTicket} from "../modals/AddTicket";

function TicketTable({ticketInformation, setIsModalOpen, onEditTicket, onDeleteTicket}){
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketInformation.map((ticket) => (
                            <tr key={ticket.ticket_id}>
                                <td>{ticket.ticket_type}</td>
                                <td>${ticket.price}</td>
                                <td>
                                    <button onClick={() => onEditTicket(ticket)} className="action-btn edit-button">Edit</button>
                                    <button onClick={() => onDeleteTicket(ticket.ticket_id)} className="action-btn delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function TicketReport(){
    const [ticketInformation, setTicketInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    
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
    const handleEditTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsEditOpen(true);
    };
    const handleUpdateTicket = (updatedTicket) => {
        setTicketInformation(prev => prev.map(ticket => ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket));
    };
    const handleDeleteTicket = async (ticketID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/ticket-type/delete-selected',{
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ticket_id: ticketID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Ticket deleted successfully!');
                setTicketInformation(prev => prev.filter(ticket => ticket.ticket_id !== ticketID));
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to delete ticket.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <div className="db-btn">
                <h1>Coog World Tickets</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ticket</button>
                </div>
            </div>
            <TicketTable ticketInformation={ticketInformation} setIsModalOpen={setIsModalOpen} onEditTicket={handleEditTicket} onDeleteTicket={handleDeleteTicket} />
            <AddTicket isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTicket={handleAddTicket} />
            <UpdateTicket isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedTicket(null);}} ticketToEdit={selectedTicket} onUpdateTicket={handleUpdateTicket} />
        </>
    )
}

export default TicketReport;