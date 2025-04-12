import { useState, useEffect } from "react";
import AddWeather from "../modals/AddWeather.jsx";

function WeatherTable({ weatherInformation, setIsModalOpen }) {
    if (!weatherInformation || !Array.isArray(weatherInformation)) {
        return <div>No weather data is currently available.</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Condition</th>
                        <th>Water Levels</th>
                        <th>Special Alerts</th>
                        <th>Date Recorded</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {weatherInformation.map((weather) => (
                        <tr key={weather.Wtr_ID}>
                            <td>{weather.Wtr_cond}</td>
                            <td>{weather.Wtr_level}</td>
                            <td>{weather.Special_alerts}</td>
                            <td>{formatDate(weather.Wtr_created)}</td>
                            <td>
                                <button className="action-btn edit-button">Edit</button>
                                <button className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Weather() {
    const [weatherInformation, setWeatherInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter state
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [conditionFilter, setConditionFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [alertFilter, setAlertFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('/api/weather/info');
                if (!response.ok) {
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

    useEffect(() => {
        let filtered = [...weatherInformation];

        // Filter by condition
        if (conditionFilter) {
            filtered = filtered.filter(weather => weather.Wtr_cond.toLowerCase().includes(conditionFilter.toLowerCase()));
        }

        // Filter by water level
        if (levelFilter) {
            filtered = filtered.filter(weather => weather.Wtr_level.toLowerCase().includes(levelFilter.toLowerCase()));
        }

        // Filter by special alert
        if (alertFilter) {
            filtered = filtered.filter(weather => weather.Special_alerts.toLowerCase().includes(alertFilter.toLowerCase()));
        }

        // Filter by date range
        if (dateFromFilter) {
            filtered = filtered.filter(weather => new Date(weather.Wtr_created) >= new Date(dateFromFilter));
        }
        if (dateToFilter) {
            filtered = filtered.filter(weather => new Date(weather.Wtr_created) <= new Date(dateToFilter));
        }

        setFilteredWeather(filtered);
    }, [weatherInformation, conditionFilter, levelFilter, alertFilter, dateFromFilter, dateToFilter]);

    // Handle adding new weather report
    const handleAddWeather = (newWeather) => {
        setWeatherInformation([...weatherInformation, newWeather]);
    };

    // Reset filters
    const resetFilters = () => {
        setConditionFilter('');
        setLevelFilter('');
        setAlertFilter('');
        setDateFromFilter('');
        setDateToFilter('');
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="filter-controls">
                <h2>Filter Weather</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="Wtr_cond">Condition:</label>
                        <select
                            id="Wtr_cond"
                            value={conditionFilter}
                            onChange={(e) => setConditionFilter(e.target.value)}
                        >
                            <option value="">-- Select a Condition --</option>
                            <option value="Sunny">Sunny</option>
                            <option value="Windy">Windy</option>
                            <option value="Rain">Rain</option>
                            <option value="Stormy">Stormy</option>
                            <option value="Snow">Snow</option>
                            <option value="Foggy">Foggy</option>
                            <option value="Hurricane">Hurricane</option>
                            <option value="Tornado">Tornado</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="Wtr_level">Water Level:</label>
                        <select
                            id="Wtr_level"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="">-- Select a Level --</option>
                            <option value="Normal">Normal</option>
                            <option value="Severe">Severe</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="Special_alerts">Special Alerts:</label>
                        <input
                            type="text"
                            id="Special_alerts"
                            value={alertFilter}
                            onChange={(e) => setAlertFilter(e.target.value)}
                            placeholder="Enter special alert"
                        />
                    </div>
                </div>

                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="dateFrom">From Date:</label>
                        <input
                            type="date"
                            id="dateFrom"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="dateTo">To Date:</label>
                        <input
                            type="date"
                            id="dateTo"
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                        />
                    </div>
                    <button onClick={resetFilters} className="reset-button">Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Weather Report</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>
                        Add Weather
                    </button>
                </div>
            </div>
            <WeatherTable
                weatherInformation={filteredWeather}
                setIsModalOpen={setIsModalOpen}
            />
            <AddWeather
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddWeather={handleAddWeather}
            />
        </>
    );
}

export default Weather;
