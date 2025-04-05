import AddRide from "../modals/AddRide";
import './Report.css'
import { useEffect, useState } from "react";

function RideTable({rideInformation, setIsModalOpen}){
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
                        <th>Last Maintenance</th>
                        <th>Ride Cost</th>
                        <th>Operational Status</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {rideInformation.map((ride) => (
                        <tr key={ride.Ride_ID}>
                            <td>{ride.Ride_name}</td>
                            <td>{ride.Ride_type}</td>
                            <td>{formatDate(ride.Ride_maint)}</td>
                            <td>${Number(ride.Ride_cost).toLocaleString()}</td>
                            <td>{ride.Is_operate ? 'Operational' : 'Under Maintenance'}</td>
                            <td>{formatDate(ride.Ride_created)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ride</button>
            </div>
        </div>
    );
}

function Ride(){
    const [rideInformation, setRideInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }

    return(
        <>
            <h1>Coog World Rides</h1>
            <RideTable rideInformation={rideInformation} setIsModalOpen={setIsModalOpen} />
            <AddRide isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRide={handleAddRide} />
        </>
    )
}

export default Ride;