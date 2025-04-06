import { useEffect, useState } from "react";
import rideImg from "../images/ride1.jpg";
import { useNavigate } from "react-router-dom";

function RideCard({ ride, onRideClick }) {
    console.log("📦 RideCard sending ID:", ride?.Ride_ID);
    console.log("📦 ride object:", ride);
  
    return (
      <div className="ride-card">
        <img src={rideImg} alt="ride image" draggable="false" />
        <h3>{ride.Ride_name}</h3>
        <p>Located in: {ride.area_name}</p>
        <p>{ride.Ride_type} Ride</p>
        <button className="fancy" onClick={() => onRideClick(ride.Ride_ID)}>
          🎢 Get on Ride
        </button>
      </div>
    );
  }  
    

function ParkRides() {
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleGetOnRide = async (rideId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const visitorId = user?.id;  // ✅ FIXED: You saved the ID as "id", not "Visitor_ID"
  
    console.log("🚀 Attempting to log ride:");
    console.log("Visitor_ID:", visitorId, "Ride_ID:", rideId);
  
    if (!visitorId || !rideId) {
      alert("You must be logged in to log a ride.");
      return navigate("/login");
    }
  
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
      console.log("📬 Server response:", result);
  
      if (res.ok) {
        alert("🎉 Ride logged successfully!");
      } else {
        alert(`❌ Failed: ${result.message}`);
      }
    } catch (err) {
      console.error("❌ Error logging ride:", err);
      alert("An error occurred while logging the ride.");
    }
  };    
    

  if (loading) return <></>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="page-titles">Explore the rides of Coog World</h1>
      <div className="ride-container">
        {rideOptions.map((ride, index) => (
          <RideCard key={index} ride={ride} onRideClick={handleGetOnRide} />
        ))}
      </div>
    </>
  );
}

export default ParkRides;
