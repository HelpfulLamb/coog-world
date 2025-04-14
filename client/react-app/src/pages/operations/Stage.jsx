import React, { useState, useEffect } from 'react';
import { AddStage, UpdateStage } from '../modals/AddStage.jsx';
import toast from 'react-hot-toast';

const StageList = () => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filteredStages, setFilteredStages] = useState([]);
    const [stageNameFilter, setStageNameFilter] = useState('');
    const [areaNameFilter, setAreaNameFilter] = useState('');
    const [staffNumberFilter, setStaffNumberFilter] = useState('');
    const [seatNumberFilter, setSeatNumberFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [isOperationalFilter, setIsOperationalFilter] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stageToEdit, setStageToEdit] = useState(null);

    useEffect(() => {
        fetchStages();
    }, []);

    const fetchStages = async () => {
        try {
            const response = await fetch('/api/stages/all');
            if (response.ok) {
                const data = await response.json();
                setStages(data);
                setFilteredStages(data);
            } else {
                setError('Failed to load stages.');
                toast.error('Failed to load stages.');
            }
        } catch (err) {
            setError('Error fetching stages.');
            toast.error('Error fetching stages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...stages];

        if (stageNameFilter) {
            filtered = filtered.filter(stage =>
                stage.Stage_name.toLowerCase().includes(stageNameFilter.toLowerCase())
            );
        }

        if (areaNameFilter) {
            filtered = filtered.filter(stage =>
                stage.area_name.toLowerCase().includes(areaNameFilter.toLowerCase())
            );
        }

        if (staffNumberFilter) {
            filtered = filtered.filter(stage =>
                stage.Staff_num.toString().includes(staffNumberFilter)
            );
        }

        if (seatNumberFilter) {
            filtered = filtered.filter(stage =>
                stage.Seat_num.toString().includes(seatNumberFilter)
            );
        }

        if (dateFromFilter) {
            filtered = filtered.filter(
                stage => new Date(stage.Stage_maint) >= new Date(dateFromFilter)
            );
        }

        if (dateToFilter) {
            filtered = filtered.filter(
                stage => new Date(stage.Stage_maint) <= new Date(dateToFilter)
            );
        }

        if (isOperationalFilter !== '') {
            filtered = filtered.filter(
                stage => stage.Is_operate === (isOperationalFilter === '1' ? 1 : 0)
            );
        }

        setFilteredStages(filtered);
    }, [
        stageNameFilter,
        areaNameFilter,
        staffNumberFilter,
        seatNumberFilter,
        dateFromFilter,
        dateToFilter,
        isOperationalFilter,
        stages,
    ]);

    const handleEditStage = (stage) => {
        setStageToEdit(stage);
        setIsEditModalOpen(true);
    };

    const handleDeleteStage = async (stage) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this stage?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            deleteStage(stage);
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

    const deleteStage = async (stage) => {
        try {
            const toastId = toast.loading('Deleting stage...');
            const response = await fetch(`/api/stages/delete/${stage.Stage_ID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast.success('Stage deleted successfully!', { id: toastId });
                const updatedStages = stages.filter(s => s.Stage_ID !== stage.Stage_ID);
                setStages(updatedStages);
                setFilteredStages(updatedStages);
            } else {
                toast.error('Failed to delete stage.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred while deleting the stage.');
        }
    };

    const resetFilters = () => {
        setStageNameFilter('');
        setAreaNameFilter('');
        setStaffNumberFilter('');
        setSeatNumberFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        setIsOperationalFilter('');
        toast.success('Filters reset successfully!');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleAddStage = (newStage) => {
        setStages(prev => [...prev, newStage]);
        setFilteredStages(prev => [...prev, newStage]);
        toast.success('Stage added successfully!');
        fetchStages();
    };

    const handleUpdateStage = (updatedStage) => {
        const updatedList = stages.map(s => s.Stage_ID === updatedStage.Stage_ID ? updatedStage : s);
        setStages(updatedList);
        setFilteredStages(updatedList);
        toast.success('Stage updated successfully!');
        fetchStages();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="filter-controls">
                <h2>Filter Stages</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="stageName">Stage Name:</label>
                        <input
                            type="text"
                            id="stageName"
                            value={stageNameFilter}
                            onChange={(e) => setStageNameFilter(e.target.value)}
                            placeholder="Enter stage name"
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="areaName">Area Name:</label>
                        <input
                            type="text"
                            id="areaName"
                            value={areaNameFilter}
                            onChange={(e) => setAreaNameFilter(e.target.value)}
                            placeholder="Enter area name"
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="staffNumber">Staff Number:</label>
                        <input
                            type="number"
                            id="staffNumber"
                            value={staffNumberFilter}
                            onChange={(e) => setStaffNumberFilter(e.target.value)}
                            placeholder="Enter staff number"
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="seatNumber">Seat Number:</label>
                        <input
                            type="number"
                            id="seatNumber"
                            value={seatNumberFilter}
                            onChange={(e) => setSeatNumberFilter(e.target.value)}
                            placeholder="Enter seat number"
                        />
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
                </div>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="isOperational">Operational Status:</label>
                        <select
                            id="isOperational"
                            value={isOperationalFilter}
                            onChange={(e) => setIsOperationalFilter(e.target.value)}
                        >
                            <option value="">-- Select Operational Status --</option>
                            <option value="1">Operational</option>
                            <option value="0">Not Operational</option>
                        </select>
                    </div>
                    <button onClick={resetFilters} className="reset-button">Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Stage List</h1>
                <button className="add-button" onClick={() => setIsAddModalOpen(true)}>Add New Stage</button>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Stage Name</th>
                            <th>Area Name</th>
                            <th>Last Maintained</th>
                            <th>Staff Number</th>
                            <th>Seat Number</th>
                            <th>Is Operating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStages.map((stage) => (
                            <tr key={stage.Stage_ID}>
                                <td>{stage.Stage_name}</td>
                                <td>{stage.area_name}</td>
                                <td>{formatDate(stage.Stage_maint)}</td>
                                <td>{stage.Staff_num}</td>
                                <td>{stage.Seat_num}</td>
                                <td>{stage.Is_operate === 1 ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => handleEditStage(stage)} className="action-btn edit-button">Edit</button>
                                    <button onClick={() => handleDeleteStage(stage)} className="action-btn delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddStage
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddStage={handleAddStage}
            />
            <UpdateStage
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                stageToEdit={stageToEdit}
                onUpdateStage={handleUpdateStage}
            />
        </div>
    );
};

export default StageList;