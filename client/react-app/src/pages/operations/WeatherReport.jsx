import { useState, useEffect } from "react";

function WeatherTable({weatherInformation}){
    if(!weatherInformation || weatherInformation.length === 0){
        return <div className="data-missing-msg">No weather data is currently available.</div>
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
                        <th>Weather ID</th>
                        <th>Condition</th>
                        <th>Water Levels</th>
                        <th>Special Alerts</th>
                        <th>Date Recorded</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherInformation.map((weather) => (
                        <tr key={weather.Wtr_ID}>
                            <td>{weather.Wtr_ID}</td>
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
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Weather Report</h1>
            <WeatherTable weatherInformation={weatherInformation} />
        </>
    )
}

export default Weather;