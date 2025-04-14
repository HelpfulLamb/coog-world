import { useState, useEffect } from "react";
import showImg from "../images/show1.jpeg";
import { useNavigate } from "react-router-dom";

function ShowCard({show, onShowClick}){
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="show-card">
            <img src={showImg} alt="show image" draggable='false' />
            <h3>{show.Show_name}</h3>
            <p>{formatDate(show.Show_date)}</p>
            <p>{show.Show_start}</p>
            <p>{show.Stage_name}</p>
            <p>Located in: {show.area_name}</p>
            <button className="fancy" onClick={() => onShowClick(show.Show_ID)}>Add to my Trip</button>
        </div>
    );
}

function ParkShows(){
    const [showOptions, setShowOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await fetch('/api/shows/user-view');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status" ${response.status}`);
                }
                const data = await response.json();
                setShowOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShows();
    }, []);
    const handleWatchShow = async (showID) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const visitorId = user?.id;
        if(!visitorId || !showID){
            alert('you must be logged in to watch a show.')
            return navigate('/login');
        }
        try {
            const response = await fetch('/api/shows/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Visitor_ID: visitorId,
                    Show_ID: showID,
                }),
            });
            const result = await response.json();
            if(response.ok){
                alert('Show Logged successfully');
            } else {
                alert(`Failed: ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Error logging ride:", error);
            alert("An error occurred while logging the show.");
        }
    };
    if(loading){
        return <></>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1 className="page-titles">Experience shows at Coog World</h1>
            <div className="show-container">
                {showOptions.map((show, index) => (
                    <ShowCard key={index} onShowClick={handleWatchShow} show={show} />
                ))}
            </div>
        </>
    );
}

export default ParkShows;