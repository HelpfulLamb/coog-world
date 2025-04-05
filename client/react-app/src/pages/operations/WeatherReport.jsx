import { useState, useEffect } from "react";
import AddWeather from "../modals/AddWeather";

function WeatherTable({weatherInformation, setIsModalOpen}){
    if(!weatherInformation || !Array.isArray(weatherInformation)){
        return <div>No weather data is currently available.</div>
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
                        <th>Condition</th>
                        <th>Water Levels</th>
                        <th>Special Alerts</th>
                        <th>Date Recorded</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherInformation.map((weather) => (
                        <tr key={weather.Wtr_ID}>
                            <td>{weather.Wtr_cond}</td>
                            <td>{weather.Wtr_level}</td>
                            <td>{weather.Special_alerts}</td>
                            <td>{formatDate(weather.Wtr_created)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Weather(){
    const [weatherInformation, setWeatherInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('/api/weather/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setWeatherInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);
    const handleAddWeather = (newWeather) => {
        setWeatherInformation([...weatherInformation, newWeather]);
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
                <h1>Weather Report</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Weather</button>
                </div>
            </div>
            <WeatherTable weatherInformation={weatherInformation} setIsModalOpen={setIsModalOpen} />
            <AddWeather isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddWeather={handleAddWeather} />
        </>
    )
}

export default Weather;