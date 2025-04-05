import { useEffect, useState } from "react";
import rideImg from "../images/ride1.jpg";

function RideCard({name, type, location}){
    return(
        <>
            <div className="ride-card">
                <img src={rideImg} alt="ride image" draggable='false' />
                <h3>{name}</h3>
                <p>Located in: {location}</p>
                <p>{type} Ride</p>
            </div>
        </>
    );
}

function ParkRides(){
    const [rideOptions, setRideOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await fetch('/api/rides/user-view');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status" ${response.status}`);
                }
                const data = await response.json();
                setRideOptions(data)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, []);
    if(loading){
        return <></>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1 className="page-titles">Explore the rides of Coog World</h1>
            <div className="ride-container">
                {rideOptions.map((ride, index) => (
                    <RideCard key={index} name={ride.Ride_name} location={ride.area_name} type={ride.Ride_type} />
                ))}
            </div>
        </>
    );
}

export default ParkRides;