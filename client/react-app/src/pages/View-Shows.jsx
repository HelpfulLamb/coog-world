import { useState, useEffect } from "react";
import showImg from "../images/show1.jpeg";

function ShowCard({name, date, stage, location, start_time}){
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="show-card">
            <img src={showImg} alt="show image" draggable='false' />
            <h3>{name}</h3>
            <p>{formatDate(date)}</p>
            <p>{start_time}</p>
            <p>{stage}</p>
            <p>Located in: {location}</p>
        </div>
    );
}

function ParkShows(){
    const [showOptions, setShowOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                    <ShowCard key={index} name={show.Show_name} date={show.Show_date} stage={show.Stage_name} location={show.area_name} start_time={show.Show_start} />
                ))}
            </div>
        </>
    );
}

export default ParkShows;