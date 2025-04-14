import AddRide, {UpdateRide} from "../modals/AddRide";
import './Report.css'
import React, { useEffect, useState } from "react";

function RideFrequencyReport() {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [rideFrequencyData, setRideFrequencyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const maxMonth = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

    // Fetch ride frequency data based on the selected month
    const fetchRideFrequencyData = async (month) => {
        if (!month) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/rides/ride-stats?month=${month}`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            setRideFrequencyData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
        fetchRideFrequencyData(month);
    };

    useEffect(() => {
        let filtered = [...rideFrequencyData];
        if (searchTerm) {
            filtered = filtered.filter(ride =>
                ride.top_rider.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        switch (sortOption) {
            case 'nameAsc':
                filtered.sort((a, b) => a.ride_name.localeCompare(b.ride_name));
                break;
            case 'nameDesc':
                filtered.sort((a, b) => b.ride_name.localeCompare(a.ride_name));
                break;
            case 'timesRiddenAsc':
                filtered.sort((a, b) => a.total_rides - b.total_rides);
                break;
            case 'timesRiddenDesc':
                filtered.sort((a, b) => b.total_rides - a.total_rides);
                break;
            case 'topRiderCountAsc':
                filtered.sort((a, b) => a.top_rides - b.top_rides);
                break;
            case 'topRiderCountDesc':
                filtered.sort((a, b) => b.top_rides - a.top_rides);
                break;
            default:
                break;
        }
        setFilteredData(filtered);
    }, [rideFrequencyData, searchTerm, sortOption]);

    return (
        <div className="ride-frequency-report">
            <h2>Ride Frequency Report</h2>

            <div className="filter-controls">
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="month">Select Month:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={handleMonthChange} max={maxMonth} className="month-input" />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="searchTerm">Search Top Rider Name:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search by ride name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sortOption">Sort By:</label>
                        <select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Select Sorting --</option>
                            <option value="nameAsc">Ride Name (A-Z)</option>
                            <option value="nameDesc">Ride Name (Z-A)</option>
                            <option value="timesRiddenDesc">Times Ridden (High to Low)</option>
                            <option value="topRiderCountDesc">Top Rider's Count (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && filteredData.length > 0 && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Times Ridden</th>
                                <th>Top Rider</th>
                                <th>Top Rider's Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((ride, index) => (
                                <tr key={index}>
                                    <td>{ride.ride_name}</td>
                                    <td>{ride.total_rides}</td>
                                    <td>{ride.top_rider}</td>
                                    <td>{ride.top_rides}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && rideFrequencyData.length === 0 && selectedMonth && (
                <p>No data available for the selected month.</p>
            )}
        </div>
    );
}

function RideTable({rideInformation, setIsModalOpen, onEditRide, onDeleteRide}){
    if(!rideInformation || !Array.isArray(rideInformation)){
        return <div>No ride data is available.</div>
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
                        <th>Ride Name</th>
                        <th>Ride Type</th>
                        <th>Location</th>
                        <th>Last Maintenance</th>
                        <th>Ride Cost</th>
                        <th>Operational Status</th>
                        <th>Date Added</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rideInformation.map((ride) => (
                        <tr key={ride.Ride_ID}>
                            <td>{ride.Ride_name}</td>
                            <td>{ride.Ride_type}</td>
                            <td>{ride.area_name}</td>
                            <td>{formatDate(ride.Ride_maint)}</td>
                            <td>${Number(ride.Ride_cost).toLocaleString()}</td>
                            <td>{ride.Is_operate ? 'Operational' : 'Under Maintenance'}</td>
                            <td>{formatDate(ride.Ride_created)}</td>
                            <td>
                                <button onClick={() => onEditRide(ride)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteRide(ride.Ride_ID)} className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Ride(){
    const [rideInformation, setRideInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);

    const [filteredRides, setFilteredRides] = useState('');
    const [rideNameFilter, setRideNameFilter] = useState('');
    const [rideTypeFilter, setRideTypeFilter] = useState('');
    const [rideLocationFilter, setRideLocationFilter] = useState('');
    const [costRangeFilter, setCostRangeFilter] = useState('');
    const [rideStatusFilter, setRideStatusFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const fetchRides = async () => {
        try {
            const response = await fetch('/api/rides/info');
            if(!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            setRideInformation(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    useEffect(() => {
        let filtered = [...rideInformation];
        const toDateOnly = (date) => {
            return new Date(date).toISOString().split('T')[0];
        };
        if(rideNameFilter){
            filtered = filtered.filter(ride => ride.Ride_name.toLowerCase().includes(rideNameFilter.toLowerCase()));
        }
        if(rideTypeFilter){
            filtered = filtered.filter(ride => ride.Ride_type.toLowerCase().includes(rideTypeFilter.toLowerCase()));
        }
        if(rideLocationFilter){
            filtered = filtered.filter(ride => ride.area_name.toLowerCase().includes(rideLocationFilter.toLowerCase()));
        }
        if(rideStatusFilter){
            filtered = filtered.filter(ride => ride.Is_operate.toLowerCase().includes(rideStatusFilter.toLowerCase()));
        }
        if(costRangeFilter){
            const [min, max] = costRangeFilter.split('-').map(Number);
            filtered = filtered.filter(ride => {
                const cost = Number(ride.Ride_cost);
                return cost >= min && (isNaN(max) || cost <= max);
            });
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'nameAsc':
                    return a.Ride_name.localeCompare(b.Ride_name);
                case 'nameDesc':
                    return b.Ride_name.localeCompare(a.Ride_name);
                case 'costAsc':
                    return a.Ride_cost - b.Ride_cost;
                case 'costDesc':
                    return b.Ride_cost - a.Ride_cost;
                default:
                    return 0;
            }
        });
        setFilteredRides(filtered);
    }, [rideInformation, rideNameFilter, rideTypeFilter, rideLocationFilter, rideStatusFilter, costRangeFilter, sortOption]);

    const handleAddRide = (newRide) => {
        setRideInformation([...rideInformation, newRide]);
    };
    const handleEditRide = (ride) => {
        setSelectedRide(ride);
        setIsEditOpen(true);
    };
    const handleUpdateRide = (updatedRide) => {
        setRideInformation(prev => prev.map(ride => ride.Ride_ID === updatedRide.Ride_ID ? updatedRide : ride));
    };
    const handleDeleteRide = async (rideID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this ride? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/rides/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Ride_ID: rideID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Ride deleted Successfully');
                setRideInformation(prev => prev.filter(ride => ride.Ride_ID !== rideID));
                fetchRides();
            } else {
                alert(data.message || 'Failed to delete ride.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    const resetFilters = () => {
        setRideNameFilter('');
        setRideTypeFilter('');
        setRideLocationFilter('');
        setRideStatusFilter('');
        setCostRangeFilter('');
        setSortOption('');
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }

    return(
        <>
            <div className="filter-controls">
                <h2>Filter Rides</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="rideName">Ride Name:</label>
                        <input type="text" id="rideName" value={rideNameFilter} onChange={(e) => setRideNameFilter(e.target.value)} placeholder="Filter by ride name" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="rideType">Ride Type:</label>
                        <select id="rideType" value={rideTypeFilter} onChange={(e) => setRideTypeFilter(e.target.value)}>
                            <option value="">-- Select a Type --</option>
                            <option value="Normal">Normal</option>
                            <option value="Water">Water</option>
                            <option value="Thrill">Thrill</option>
                            <option value="Family">Family</option>
                            <option value="Spinning">Spinning</option>
                            <option value="Water Coaster">Water Coaster</option>
                            <option value="Extreme">Extreme</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="rideLoc">Ride Location:</label>
                        <select id="rideLoc" value={rideLocationFilter} onChange={(e) => setRideLocationFilter(e.target.value)}>
                            <option value="">-- Select a Location --</option>
                            <option value="Magic Coogs">Magic Coogs</option>
                            <option value="Splash Central">Splash Central</option>
                            <option value="Highrise Coogs">Highrise Coogs</option>
                            <option value="Lowball City">Lowball City</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="costRange">Cost Range:</label>
                        <select id="costRange" value={costRangeFilter} onChange={(e) => setCostRangeFilter(e.target.value)}>
                            <option value="">-- Select a Cost Range --</option>
                            <option value="35000-99999">$35,000 - $99,999</option>
                            <option value="100000-999999">$100,000 - $999,999</option>
                            <option value="1000000-9999999">$1,000,000 - $9,999,999</option>
                            <option value="10000000-29999999">$10,000,000 - $29,999,999</option>
                            <option value="30000000-999999999999">$30,000,000+</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Sort Method --</option>
                            <option value="nameAsc">Ride Name (A-Z)</option>
                            <option value="nameDesc">Ride Name (Z-A)</option>
                            <option value="costAsc">Cost (Low to High)</option>
                            <option value="costDesc">Cost (High to Low)</option>
                        </select>
                    </div>
                </div>
                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Coog World Rides</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ride</button>
                </div>
            </div>
            <RideTable rideInformation={filteredRides} setIsModalOpen={setIsModalOpen} onEditRide={handleEditRide} onDeleteRide={handleDeleteRide} />
            <AddRide isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRide={handleAddRide} />
            <UpdateRide isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedRide(null);}} rideToEdit={selectedRide} onUpdateRide={handleUpdateRide} />
            <RideFrequencyReport setIsModalOpen={setIsModalOpen}/>
        </>
    )
}

export default Ride;
