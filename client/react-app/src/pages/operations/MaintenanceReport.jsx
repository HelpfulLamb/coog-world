import React, { useState, useEffect } from "react";
import AddMaintenance from "../modals/AddMaintenance.jsx";
import toast from 'react-hot-toast';

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
                                        <button onClick={() => onStatusChange(maintenance)} className="action-btn edit-button">In Progress</button>
                                        <button onClick={() => onStatusChange(maintenance)} className="action-btn delete-button">Complete</button>
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
                const toastId = toast.loading('Loading maintenance data...');
                const response = await fetch('/api/maintenance/info');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMaintenanceInformation(data);
                toast.success('Maintenance data loaded successfully!', { id: toastId });
            } catch (error) {
                toast.error(error.message);
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
            filtered = filtered.filter(maintenance => 
                maintenance.Maint_obj_name.toLowerCase().includes(objectNameFilter.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(maintenance => maintenance.Maint_Status === statusFilter);
        }

        // Filter by date range
        if (dateFromFilter) {
            filtered = filtered.filter(maintenance => 
                new Date(maintenance.Maintenance_Date) >= new Date(dateFromFilter)
            );
        }
        if (dateToFilter) {
            filtered = filtered.filter(maintenance => 
                new Date(maintenance.Maintenance_Date) <= new Date(dateToFilter)
            );
        }

        setFilteredMaintenance(filtered);
    }, [maintenanceInformation, costMinFilter, costMaxFilter, typeFilter, objectFilter, 
        objectNameFilter, statusFilter, dateFromFilter, dateToFilter]);

    const handleAddMaintenance = (newMaintenance) => {
        setMaintenanceInformation([...maintenanceInformation, newMaintenance]);
        toast.success('Maintenance report added successfully!');
    };

    const handleStatusUpdate = (maintenance) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to change status to '{maintenance.Maint_Status === 'Pending' ? 'In Progress' : 'Completed'}'?</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            updateStatus(maintenance);
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

    const updateStatus = async (maintenance) => {
        const newStatus = maintenance.Maint_Status === 'Pending' ? 'In Progress' : 'Completed';
        try {
            const toastId = toast.loading(`Updating status to ${newStatus}...`);
            const response = await fetch(`/api/maintenance/status/${maintenance.MaintID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ 
                    Maint_Status: newStatus, 
                    Maint_obj: maintenance.Maint_obj, 
                    Maint_obj_ID: maintenance.Maint_obj_ID 
                }),
            });
            
            if (response.ok) {
                toast.success(`Status updated to '${newStatus}' successfully!`, { id: toastId });
                setMaintenanceInformation(prev => 
                    prev.filter(maint => maint.MaintID !== maintenance.MaintID)
                );
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to update maintenance status.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
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
        toast.success('Filters reset successfully!');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
        </>
    );
}

export default Maintenance;