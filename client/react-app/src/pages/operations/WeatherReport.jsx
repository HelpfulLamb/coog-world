import { useState, useEffect } from "react";
import AddWeather, {UpdateWeather} from "../modals/AddWeather.jsx";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext.jsx";

function WeatherTable({ weatherInformation, setIsModalOpen, onEditWtr, onDeleteWtr, user}){
    if(!weatherInformation || !Array.isArray(weatherInformation)){
        return <div>No weather information data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const isAuthorized = user && (user.role === 'admin' || user.role === 'manager');
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
                        {isAuthorized && <th>Actions</th>}
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
                            {isAuthorized && (
                                <td>
                                    <button onClick={() => onEditWtr(weather)} className="action-btn edit-button">Edit</button>
                                    <button onClick={() => onDeleteWtr(weather)} className="action-btn delete-button">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Weather() {
    const {user} = useAuth();
    const [weatherInformation, setWeatherInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedWeather, setSelectedWeather] = useState(null);

    const [filteredWeather, setFilteredWeather] = useState([]);
    const [conditionFilter, setConditionFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const fetchWeather = async () => {
        try {
            const toastId = toast.loading('Loading weather data...');
            const response = await fetch('/api/weather/info');
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            setWeatherInformation(data);
            toast.success('Weather data loaded successfully!', { id: toastId });
        } catch (error) {
            toast.error(error.message);
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
            filtered = filtered.filter(weather => 
                weather.Wtr_cond.toLowerCase().includes(conditionFilter.toLowerCase())
            );
        }
        if (levelFilter) {
            filtered = filtered.filter(weather => 
                weather.Wtr_level.toLowerCase().includes(levelFilter.toLowerCase())
            );
        }
        if (dateFromFilter) {
            filtered = filtered.filter(weather => 
                toDateOnly(weather.Wtr_created) >= toDateOnly(dateFromFilter)
            );
        }
        if (dateToFilter) {
            filtered = filtered.filter(weather => 
                toDateOnly(weather.Wtr_created) <= toDateOnly(dateToFilter)
            );
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
        toast.success('Weather record added successfully!');
    };

    const handleEditWeather = (weather) => {
        setSelectedWeather(weather);
        setIsEditOpen(true);
    };

    const handleUpdateWeather = (updatedWeather) => {
        setWeatherInformation(prev => 
            prev.map(weather => weather.Wtr_ID === updatedWeather.Wtr_ID ? updatedWeather : weather)
        );
        toast.success('Weather record updated successfully!');
    };

    const handleDeleteWeather = (weather) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this weather log?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            deleteWeather(weather);
                            toast.dismiss(t.id);
                        }}
                        className="toast-confirm"
                    >
                        Confirm
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="toast-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
        });
    };

    const deleteWeather = async (weather) => {
        try {
            const toastId = toast.loading('Deleting weather record...');
            const response = await fetch('/api/weather/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Wtr_ID: weather.Wtr_ID}),
            });
            
            if(response.ok){
                toast.success('Weather record deleted successfully!', { id: toastId });
                setWeatherInformation(prev => 
                    prev.filter(w => w.Wtr_ID !== weather.Wtr_ID)
                );
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete weather record.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const resetFilters = () => {
        setConditionFilter('');
        setLevelFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        setSortOption('');
        toast.success('Filters reset successfully!');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const isAuthorized = user && (user.role === 'admin' || user.role === 'manager');
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
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select 
                            id="sort" 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                        >
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
                    {isAuthorized && (
                        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Weather</button>
                    )}
                </div>
            </div>
            <WeatherTable 
                weatherInformation={filteredWeather} 
                setIsModalOpen={setIsModalOpen} 
                onEditWtr={handleEditWeather} 
                onDeleteWtr={handleDeleteWeather}
                user={user} />
            <AddWeather 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddWeather={handleAddWeather} />
            <UpdateWeather 
                isOpen={isEditOpen} 
                onClose={() => {
                    setIsEditOpen(false); 
                    setSelectedWeather(null);
                }} 
                wtrToEdit={selectedWeather} 
                onUpdateWtr={handleUpdateWeather} 
            />
        </>
    );
}

export default Weather;