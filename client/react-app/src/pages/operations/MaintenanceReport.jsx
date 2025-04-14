import React, { useState, useEffect } from "react";
import AddMaintenance from "../modals/AddMaintenance.jsx";

function RideMaintenanceReport() {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [rideMaintenanceData, setRideMaintenanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    //Calculate Total
    const getTotalMaintenance = () => {
        return filteredData.reduce((sum, ride) => sum + (ride.total_maintenance || 0), 0);
    };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const maxMonth = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

    // Fetch ride frequency data based on the selected month
    const fetchRideMaintenanceData = async (month) => {
        if (!month) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/maintenance/avg-stat?month=${month}`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            setRideMaintenanceData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle dropdown change
    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
        fetchRideMaintenanceData(month);
    };

    useEffect(() => {
        let filtered = [...rideMaintenanceData];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(ride =>
                ride.ride_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort the data
        switch (sortOption) {
            case 'nameAsc':
              filtered.sort((a, b) => a.ride_name.localeCompare(b.ride_name));
              break;
            case 'nameDesc':
              filtered.sort((a, b) => b.ride_name.localeCompare(a.ride_name));
              break;
            case 'maintenanceAsc':
              filtered.sort((a, b) => a.total_maintenance - b.total_maintenance);
              break;
            case 'maintenanceDesc':
              filtered.sort((a, b) => b.total_maintenance - a.total_maintenance);
              break;
            default:
              break;
        }

        setFilteredData(filtered);
    }, [rideMaintenanceData, searchTerm, sortOption]);

    return (
        <div className="ride-maintenance-report">
            <h2>Ride Maintenance Report</h2>

            <div className="filter-controls">
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="month">Select Month:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={handleMonthChange} max={maxMonth} className="month-input" />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="searchTerm">Search Ride Name:</label>
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
                            <option value="maintenanceAsc">Maintenance Count (Low to High)</option>
                            <option value="maintenanceDesc">Maintenance Count (High to Low)</option>
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
                                <th>Times Maintenance</th>
                                <th>Message</th>
                                <th>Message Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((ride, index) => (
                                <tr key={index}>
                                    <td>{ride.ride_name}</td>
                                    <td>{ride.total_maintenance}</td>
                                    <td>{ride.log_message}</td>
                                    <td>{formatDate(ride.log_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td><strong>{getTotalMaintenance()}</strong></td>
                                <td colSpan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {!loading && !error && rideMaintenanceData.length === 0 && selectedMonth && (
                <p>No data available for the selected month.</p>
            )}
        </div>
    );
}

function MaintenanceTable({ maintenanceInformation, setIsModalOpen, onStatusChange }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date Reported</th>
                        <th>Maintenance Cost</th>
                        <th>Type</th>
                        <th>Object</th>
                        <th>Object Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceInformation.map((maintenance) => (
                        <tr key={maintenance.MaintID}>
                            <td>{formatDate(maintenance.Maintenance_Date)}</td>
                            <td>${Number(maintenance.Maint_cost).toLocaleString()}</td>
                            <td>{maintenance.Maint_Type}</td>
                            <td>{maintenance.Maint_obj}</td>
                            <td>{maintenance.Maint_obj_name}</td>
                            <td>{maintenance.Maint_Status}</td>
                            <td>
                                {maintenance.Maint_Status !== 'Completed' && (
                                    <>
                                        <button onClick={() => onStatusChange(maintenance.MaintID, 'In Progress', maintenance.Maint_obj, maintenance.Maint_obj_ID)} className="action-btn edit-button">In Progress</button>
                                        <button onClick={() => onStatusChange(maintenance.MaintID, 'Completed', maintenance.Maint_obj, maintenance.Maint_obj_ID)} className="action-btn delete-button">Complete</button>
                                    </>
                                )}
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Maintenance() {
    const [maintenanceInformation, setMaintenanceInformation] = useState([]);
    const [filteredMaintenance, setFilteredMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter state
    const [costMinFilter, setCostMinFilter] = useState('');
    const [costMaxFilter, setCostMaxFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [objectFilter, setObjectFilter] = useState('');
    const [objectNameFilter, setObjectNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');

    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                const response = await fetch('/api/maintenance/info');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMaintenanceInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMaintenance();
    }, []);

    useEffect(() => {
        let filtered = [...maintenanceInformation];

        // Filter by cost
        if (costMinFilter) {
            filtered = filtered.filter(maintenance => parseFloat(maintenance.Maint_cost) >= parseFloat(costMinFilter));
        }
        if (costMaxFilter) {
            filtered = filtered.filter(maintenance => parseFloat(maintenance.Maint_cost) <= parseFloat(costMaxFilter));
        }

        // Filter by type
        if (typeFilter) {
            filtered = filtered.filter(maintenance => maintenance.Maint_Type === typeFilter);
        }

        // Filter by object
        if (objectFilter) {
            filtered = filtered.filter(maintenance => maintenance.Maint_obj === objectFilter);
        }

        // Filter by object name
        if (objectNameFilter) {
            filtered = filtered.filter(maintenance => maintenance.Maint_obj_name.toLowerCase().includes(objectNameFilter.toLowerCase()));
        }

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(maintenance => maintenance.Maint_Status === statusFilter);
        }

        // Filter by date range
        if (dateFromFilter) {
            filtered = filtered.filter(maintenance => new Date(maintenance.Maintenance_Date) >= new Date(dateFromFilter));
        }
        if (dateToFilter) {
            filtered = filtered.filter(maintenance => new Date(maintenance.Maintenance_Date) <= new Date(dateToFilter));
        }

        setFilteredMaintenance(filtered);
    }, [maintenanceInformation, costMinFilter, costMaxFilter, typeFilter, objectFilter, objectNameFilter, statusFilter, dateFromFilter, dateToFilter]);

    const handleAddMaintenance = (newMaintenance) => {
        setMaintenanceInformation([...maintenanceInformation, newMaintenance]);
    };

    const handleStatusUpdate = async (MaintID, Maint_Status, Maint_obj, Maint_obj_ID) => {
        const confirmStatus = window.confirm(`Mark this status as '${Maint_Status}'?`);
        if (!confirmStatus) return;
        try {
            const response = await fetch(`/api/maintenance/status/${MaintID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ Maint_Status, Maint_obj, Maint_obj_ID }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Maintenance status has been marked as '${Maint_Status}'!`);
                setMaintenanceInformation((prev) => prev.filter((maint) => maint.MaintID !== MaintID));
                setTimeout(() => { window.location.href = window.location.href; });
            } else {
                alert(data.message || 'Failed to update maintenance status.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    const resetFilters = () => {
        setCostMinFilter('');
        setCostMaxFilter('');
        setTypeFilter('');
        setObjectFilter('');
        setObjectNameFilter('');
        setStatusFilter('');
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
                <h2>Filter Maintenance</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="costMin">Min Cost:</label>
                        <input
                            type="number"
                            id="costMin"
                            value={costMinFilter}
                            onChange={(e) => setCostMinFilter(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="costMax">Max Cost:</label>
                        <input
                            type="number"
                            id="costMax"
                            value={costMaxFilter}
                            onChange={(e) => setCostMaxFilter(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="type">Type:</label>
                        <select
                            id="type"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">-- Select Type --</option>
                            <option value="Routine">Routine</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="object">Object:</label>
                        <select
                            id="object"
                            value={objectFilter}
                            onChange={(e) => setObjectFilter(e.target.value)}
                        >
                            <option value="">-- Select Object --</option>
                            <option value="ride">Ride</option>
                            <option value="stage">Stage</option>
                            <option value="kiosk">Kiosk</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="objectName">Object Name:</label>
                        <input
                            type="text"
                            id="objectName"
                            value={objectNameFilter}
                            onChange={(e) => setObjectNameFilter(e.target.value)}
                            placeholder="Enter object name"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">-- Select Status --</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
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
                <h1>Maintenance Report</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Report Maintenance</button>
                </div>
            </div>

            <MaintenanceTable
                maintenanceInformation={filteredMaintenance}
                setIsModalOpen={setIsModalOpen}
                onStatusChange={handleStatusUpdate}
            />
            <AddMaintenance
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddMaintenance={handleAddMaintenance}
            />
            <RideMaintenanceReport
            />
        </>
    );
}

export default Maintenance;
