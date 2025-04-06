import AddRide, {UpdateRide} from "../modals/AddRide";
import './Report.css'
import { useEffect, useState } from "react";

function RideTable({rideInformation, setIsModalOpen, onEditRide}){
    if(!rideInformation || !Array.isArray(rideInformation)){
        return <div>No ride data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Ride Name</th>
                        <th>Ride Type</th>
                        <th>Location</th>
                        <th>Last Maintenance</th>
                        <th>Ride Cost</th>
                        <th>Operational Status</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rideInformation.map((ride) => (
                        <tr key={ride.Ride_ID}>
                            <td>{ride.Ride_name}</td>
                            <td>{ride.Ride_type}</td>
                            <td>{ride.area_name}</td>
                            <td>{formatDate(ride.Ride_maint)}</td>
                            <td>${Number(ride.Ride_cost).toLocaleString()}</td>
                            <td>{ride.Is_operate ? 'Operational' : 'Under Maintenance'}</td>
                            <td>{formatDate(ride.Ride_created)}</td>
                            <td>
                                <button onClick={() => onEditRide(ride)}>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Ride(){
    const [rideInformation, setRideInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await fetch('/api/rides/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setRideInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, []);

    const handleAddRide = (newRide) => {
        setRideInformation([...rideInformation, newRide]);
    };
    const handleEditRide = (ride) => {
        setSelectedRide(ride);
        setIsEditOpen(true);
    };
    const handleUpdateRide = (updatedRide) => {
        setRideInformation(prev => prev.map(ride => ride.Ride_ID === updatedRide.Ride_ID ? updatedRide : ride));
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
                <h1>Coog World Rides</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ride</button>
                </div>
            </div>
            <RideTable rideInformation={rideInformation} setIsModalOpen={setIsModalOpen} onEditRide={handleEditRide} />
            <AddRide isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRide={handleAddRide} />
            <UpdateRide isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedRide(null);}} rideToEdit={selectedRide} onUpdateRide={handleUpdateRide} />
        </>
    )
}

export default Ride;