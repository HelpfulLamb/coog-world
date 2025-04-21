import AddRide, { UpdateRide } from "../modals/AddRide";
import './Report.css'
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

function RideTable({ rideInformation, setIsModalOpen, onEditRide, onDeleteRide, user }) {
    if (!rideInformation || !Array.isArray(rideInformation)) {
        return <div>No ride data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const isAuthorized = user && (user.role === 'Admin');
    return (
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
                        {isAuthorized && <th>Actions</th>}
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
                            <td>{ride.Is_operate === 1 ? 'Operational' : 'Under Maintenance'}</td>
                            <td>{formatDate(ride.Ride_created)}</td>
                            {isAuthorized && (
                                <td>
                                    <button onClick={() => onEditRide(ride)} className="action-btn edit-button">Edit</button>
                                    <button onClick={() => onDeleteRide(ride.Ride_ID)} className="action-btn delete-button">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Ride() {
    const { user } = useAuth();
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
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            setRideInformation(data);
        } catch (error) {
            setError(error.message);
            toast.error(`Failed to load rides: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    useEffect(() => {
        let filtered = [...rideInformation];
        if (rideNameFilter) {
            filtered = filtered.filter(ride => ride.Ride_name.toLowerCase().includes(rideNameFilter.toLowerCase()));
        }
        if (rideTypeFilter) {
            filtered = filtered.filter(ride => ride.Ride_type.toLowerCase().includes(rideTypeFilter.toLowerCase()));
        }
        if (rideLocationFilter) {
            filtered = filtered.filter(ride => ride.area_name.toLowerCase().includes(rideLocationFilter.toLowerCase()));
        }
        if (rideStatusFilter) {
            filtered = filtered.filter(ride => ride.Is_operate.toString().toLowerCase().includes(rideStatusFilter.toLowerCase()));
        }
        if (rideStatusFilter !== '') {
            filtered = filtered.filter(
                ride => ride.Is_operate === (rideStatusFilter === '1' ? 1 : 0)
            );
        }
        if (costRangeFilter) {
            const [min, max] = costRangeFilter.split('-').map(Number);
            filtered = filtered.filter(ride => {
                const cost = Number(ride.Ride_cost);
                return cost >= min && (isNaN(max) || cost <= max);
            });
        }
        filtered.sort((a, b) => {
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

    const handleAddRide = async () => {
        try {
            const response = await fetch('/api/rides/info');
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            setRideInformation(data);
            toast.success('Ride added successfully!');
        } catch (error) {
            toast.error(`Failed to add ride: ${error.message}`);
        }
    };

    const handleEditRide = (ride) => {
        setSelectedRide(ride);
        setIsEditOpen(true);
    };

    const handleUpdateRide = async () => {
        try {
            const response = await fetch('/api/rides/info');
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            setRideInformation(data);
            toast.success('Ride updated successfully!');
        } catch (error) {
            toast.error(`Failed to update ride: ${error.message}`);
        }
    };

    const handleDeleteRide = async (rideID) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this ride?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button
                        onClick={() => {
                            deleteRide(rideID);
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

    const deleteRide = async (rideID) => {
        try {
            const toastId = toast.loading('Deleting ride...');
            const response = await fetch('/api/rides/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ Ride_ID: rideID }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Ride deleted successfully!', { id: toastId });
                setRideInformation(prev => prev.filter(ride => ride.Ride_ID !== rideID));
                fetchRides();
            } else {
                toast.error(data.message || 'Failed to delete ride.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const resetFilters = () => {
        setRideNameFilter('');
        setRideTypeFilter('');
        setRideLocationFilter('');
        setRideStatusFilter('');
        setCostRangeFilter('');
        setSortOption('');
        toast.success('Filters reset successfully!');
    };

    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    const isAuthorized = user && (user.role === 'Admin');
    return (
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
                        <label htmlFor="isOperational">Operational Status:</label>
                        <select
                            id="isOperational"
                            value={rideStatusFilter}
                            onChange={(e) => setRideStatusFilter(e.target.value)}
                        >
                            <option value="">-- Select Operational Status --</option>
                            <option value="1">Operational</option>
                            <option value="0">Under Maintenance</option>
                        </select>
                    </div>

                </div>
                <div className="filter-row">
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
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Coog World Rides</h1>
                <div>
                    {isAuthorized && (
                        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Ride</button>
                    )}
                </div>
            </div>
            <RideTable rideInformation={filteredRides} setIsModalOpen={setIsModalOpen} onEditRide={handleEditRide} onDeleteRide={handleDeleteRide} user={user} />
            <AddRide isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddRide={handleAddRide} />
            <UpdateRide isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedRide(null); }} rideToEdit={selectedRide} onUpdateRide={handleUpdateRide} />
        </>
    )
}

export default Ride;