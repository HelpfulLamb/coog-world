import { useEffect, useState } from "react";
import rideImg from "../images/ride1.jpg";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function RideCard({ ride, onRideClick }) {
    return (
      <div className="ride-card">
        <img src={rideImg} alt="ride image" draggable="false" />
        <h3>{ride.Ride_name}</h3>
        <p>Located in: {ride.area_name}</p>
        <p>{ride.Ride_type} Ride</p>
        <button className="fancy" onClick={() => onRideClick(ride.Ride_ID)}>
          🎢 Add to my Trip
        </button>
      </div>
    );
}  

function ParkRides() {
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch("/api/rides/user-view");
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRideOptions(data);
      } catch (error) {
        setError(error.message);
        toast.error(`Failed to load rides: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleGetOnRide = async (rideId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const visitorId = user?.id;
  
    if (!visitorId || !rideId) {
      toast.error('You must be logged in to get on a ride.', {
        duration: 3000,
        position: 'top-center'
      });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const toastId = toast.loading('Logging your ride...');
  
    try {
      const res = await fetch("/api/rides/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Visitor_ID: visitorId,
          Ride_ID: rideId,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        toast.success('🎉 Ride logged successfully!', {
          id: toastId,
          duration: 3000,
          position: 'top-center'
        });
      } else {
        toast.error(`❌ Failed: ${result.message || 'Unknown error'}`, {
          id: toastId,
          duration: 4000,
          position: 'top-center'
        });
      }
    } catch (err) {
      console.error("Error logging ride:", err);
      toast.error('An error occurred while logging the ride.', {
        id: toastId,
        duration: 4000,
        position: 'top-center'
      });
    }
  };    

  if (loading) return <></>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="page-titles">Explore the rides of Coog World</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <label htmlFor="ride-type">Filter by Type: </label>
        <select
            id="ride-type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
            padding: '6px 12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
            }}>
            <option value="All">All</option>
            <option value="Normal">Normal</option>
            <option value="Water">Water</option>
            <option value="Thrill">Thrill</option>
            <option value="Family">Family</option>
            <option value="Spinning">Spinning</option>
            <option value="Water Coaster">Water Coaster</option>
            <option value="Extreme">Extreme</option>
        </select>
      </div>
      <div className="ride-container">
      {rideOptions.filter((ride) => filter === "All" || ride.Ride_type === filter).map((ride, index) => (
        <RideCard 
          key={index} 
          ride={ride} 
          onRideClick={handleGetOnRide}
        />
      ))}
      </div>
    </>
  );
}

export default ParkRides;