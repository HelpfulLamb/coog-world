import { useState, useEffect } from "react";
import AddWeather, {UpdateWeather} from "../modals/AddWeather.jsx";

function WeatherTable({ weatherInformation, setIsModalOpen, onEditWtr, onDeleteWtr }){
    if(!weatherInformation || !Array.isArray(weatherInformation)){
        return <div>No weather information data is available.</div>
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
                        <th>Recorded</th>
                        <th>Temp</th>
                        <th>Condition</th>
                        <th>Water Level</th>
                        <th>Alerts</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {weatherInformation.map((weather) => (
                        <tr key={weather.Wtr_ID}>
                            <td>{formatDate(weather.Wtr_created)}</td>
                            <td>{weather.temperature} F</td>
                            <td>{weather.Wtr_cond}</td>
                            <td>{weather.Wtr_level}</td>
                            <td>{weather.Special_alerts}</td>
                            <td>
                                <button onClick={() => onEditWtr(weather)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteWtr(weather.Wtr_ID)} className="action-btn delete-button">Delete</button>
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

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedWeather, setSelectedWeather] = useState(null);

    // Filter state
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [conditionFilter, setConditionFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

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
    useEffect(() => {
        fetchWeather();
    }, []);

    useEffect(() => {
        let filtered = [...weatherInformation];
        const toDateOnly = (date) => {
            return new Date(date);
        };
        if (conditionFilter) {
            filtered = filtered.filter(weather => weather.Wtr_cond.toLowerCase().includes(conditionFilter.toLowerCase()));
        }
        if (levelFilter) {
            filtered = filtered.filter(weather => weather.Wtr_level.toLowerCase().includes(levelFilter.toLowerCase()));
        }
        if (dateFromFilter) {
            filtered = filtered.filter(weather => toDateOnly(weather.Wtr_created) >= toDateOnly(dateFromFilter));
        }
        if (dateToFilter) {
            filtered = filtered.filter(weather => toDateOnly(weather.Wtr_created) <= toDateOnly(dateToFilter));
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'tempAsc':
                    return a.temperature - b.temperature;
                case 'tempDesc':
                    return b.temperature - a.temperature;
                case 'dateAddedAsc':
                    return toDateOnly(a.Wtr_created) - toDateOnly(b.Wtr_created);
                case 'dateAddedDesc':
                    return toDateOnly(b.Wtr_created) - toDateOnly(a.Wtr_created);
                default:
                    return 0;
            }
        });
        setFilteredWeather(filtered);
    }, [weatherInformation, conditionFilter, levelFilter, dateFromFilter, dateToFilter, sortOption]);

    const handleAddWeather = (newWeather) => {
        setWeatherInformation([...weatherInformation, newWeather]);
    };
    const handleEditWeather = (weather) => {
        setSelectedWeather(weather);
        setIsEditOpen(true);
    };
    const handleUpdateWeather = (updatedWeather) => {
        setWeatherInformation(prev => prev.map(weather => weather.Wtr_ID === updatedWeather.Wtr_ID ? updatedWeather : weather));
    };
    const handleDeleteWeather = async (wtrID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this weather log? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/weather/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Wtr_ID: wtrID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Weather deleted successfully!');
                setWeatherInformation(prev => prev.filter(weather => weather.Wtr_ID !== wtrID));
                fetchWeather();
            } else {
                alert(data.message || 'Failed to delete weather log.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    // Reset filters
    const resetFilters = () => {
        setConditionFilter('');
        setLevelFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        setSortOption('');
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
                        <select id="Wtr_cond" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
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
                        <select id="Wtr_level" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                            <option value="">-- Select a Level --</option>
                            <option value="Normal">Normal</option>
                            <option value="Severe">Severe</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="dateFrom">From Date:</label>
                        <input type="date" id="dateFrom" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="dateTo">To Date:</label>
                        <input type="date" id="dateTo" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Select a sort method --</option>
                            <option value="tempAsc">Temperature (Low to High)</option>
                            <option value="tempDesc">Temperature (High to Low)</option>
                            <option value="dateAddedAsc">Oldest Records</option>
                            <option value="dateAddedDesc">Latest Records</option>
                        </select>
                    </div>
                </div>

                <div className="filter-row">
                    <button onClick={resetFilters} className="reset-button">Reset Filters</button>
                </div>
            </div>
            <div className="db-btn">
                <h1>Weather Logs</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Weather</button>
                </div>
            </div>
            <WeatherTable weatherInformation={filteredWeather} setIsModalOpen={setIsModalOpen} onEditWtr={handleEditWeather} onDeleteWtr={handleDeleteWeather} />
            <AddWeather isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddWeather={handleAddWeather} />
            <UpdateWeather isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedWeather(null);}} wtrToEdit={selectedWeather} onUpdateWtr={handleUpdateWeather} />
        </>
    );
}

export default Weather;
