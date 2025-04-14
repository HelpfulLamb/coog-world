import AddShow, {UpdateShow} from "../modals/AddShow";
import './Report.css';
import { useState, useEffect } from "react";

function ShowTable({showInformation, setIsModalOpen, onEditShow, onDeleteShow}){
    if(!showInformation || !Array.isArray(showInformation)){
        return <div>No show data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const calculateDuration = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const startTotalMin = startHour * 60 + startMinute;
        const endTotalMin = endHour * 60 + endMinute;
        const diffMin = endTotalMin - startTotalMin;
        const hours = Math.floor(diffMin / 60);
        const minutes = diffMin % 60;
        return `${hours}h ${minutes}min`;
    };
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Show Name</th>
                        <th>Stage</th>
                        <th>Duration</th>
                        <th>Total Performers</th>
                        <th>Date Performed</th>
                        <th>Show Cost</th>
                        <th>Date Added</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {showInformation.map((show) =>(
                        <tr key={show.Show_ID}>
                            <td>{show.Show_name}</td>
                            <td>{show.Stage_name}</td>
                            <td>{calculateDuration(show.Show_start, show.Show_end)}</td>
                            <td>{show.Perf_num}</td>
                            <td>{formatDate(show.Show_date)}</td>
                            <td>${Number(show.Show_cost).toLocaleString()}</td>
                            <td>{formatDate(show.Show_created)}</td>
                            <td>
                                <button onClick={() => onEditShow(show)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteShow(show.Show_ID)} className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Show(){
    const [showInformation, setShowInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filteredShows, setFilteredShows] = useState([]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    const [showNameFilter, setShowNameFilter] = useState('');
    const [stageNameFilter, setStageNameFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const [allStages, setAllStages] = useState([]);
    const [allShows, setAllShows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stages, shows] = await Promise.all([fetch('/api/stages/all'), fetch('/api/shows/info')]);
                const stageData = await stages.json();
                const showData = await shows.json();
                setAllStages(stageData);
                setAllShows(showData);
            } catch (error) {
                setMessage({error: 'Failed to load stages or shows.', success: ''});
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await fetch('/api/shows/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setShowInformation(data);
                setFilteredShows(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
    }, []);

    useEffect(() => {
        let filtered = [...showInformation];
        const toDateOnly = (date) => {
            return new Date(date).toISOString().split('T')[0];
        };
        if(showNameFilter){
            filtered = filtered.filter(show => show.Show_name.toLowerCase().includes(showNameFilter.toLowerCase()));
        }
        if(stageNameFilter){
            filtered = filtered.filter(show => show.Stage_name.toLowerCase().includes(stageNameFilter.toLowerCase()));
        }
        if(startDateFilter){
            filtered = filtered.filter(show => toDateOnly(show.Show_date) >= startDateFilter);
        }
        if(endDateFilter){
            filtered = filtered.filter(show => toDateOnly(show.Show_date) <= endDateFilter);
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'nameAsc':
                    return a.Show_name.localeCompare(b.Show_name);
                case 'nameDesc':
                    return b.Show_name.localeCompare(a.Show_name);
                case 'datePerformed':
                    return new Date(a.Show_date) - new Date(b.Show_date);
                case 'dateAdded':
                    return new Date(a.Show_created) - new Date(b.Show_created);
                case 'costAsc':
                    return a.Show_cost - b.Show_cost;
                case 'costDesc':
                    return b.Show_cost - a.Show_cost;            
                default:
                    return 0;
            }
        });
        setFilteredShows(filtered);
    }, [showInformation, showNameFilter, stageNameFilter, startDateFilter, endDateFilter, sortOption]);

    const handleAddShow = (newShow) => {
        setShowInformation([...showInformation, newShow]);
    };
    const handleEditShow = (show) => {
        setSelectedShow(show);
        setIsEditOpen(true);
    };
    const handleUpdateShow = (updatedShow) => {
        setShowInformation(prev => prev.map(show => show.Show_ID === updatedShow.Show_ID ? updatedShow : show));
    };
    const handleDeleteShow = async (showID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this show? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/shows/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Show_ID: showID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Show deleted successfully!');
                setShowInformation(prev => prev.filter(show => show.Show_ID !== showID));
                setTimeout(() => {window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to delete show.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    const resetFilters = () => {
        setShowNameFilter('');
        setStageNameFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
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
                <h2>Filter Shows</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="showName">Show Name:</label>
                        <select type="text" id="showName" value={showNameFilter} onChange={(e) => setShowNameFilter(e.target.value)}>
                            <option value="">-- Select a Show --</option>
                            {allShows.map(show => (
                                <option key={show.Show_ID} value={show.Show_name}>{show.Show_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="stageName">Stage Name:</label>
                        <select type="text" id="stageName" value={stageNameFilter} onChange={(e) => setStageNameFilter(e.target.value)}>
                            <option value="">-- Select a Stage --</option>
                            {allStages.map(stage => (
                                <option key={stage.Stage_ID} value={stage.Stage_name}>{stage.Stage_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="startDate">Performance From Date:</label>
                        <input type="date" id="startDate" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)}/>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="endDate">Performance To Date:</label>
                        <input type="date" id="endDate" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)}/>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Select a sort method --</option>
                            <option value="datePerformed">Date Performed (Oldest First)</option>
                            <option value="nameAsc">Name (A-Z)</option>
                            <option value="nameDesc">Name (Z-A)</option>
                            <option value="dateAdded">Date Added (Oldest First)</option>
                            <option value="costAsc">Cost (Low to High)</option>
                            <option value="costDesc">Cost (High to Low)</option>
                        </select>
                    </div>
                </div>
                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>
                        Reset Filters
                    </button>
                </div>
            </div>
            <div className="db-btn">
                <h1>Coog World Shows</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Show</button>
                </div>
            </div>
            <ShowTable showInformation={filteredShows} setIsModalOpen={setIsModalOpen} onEditShow={handleEditShow} onDeleteShow={handleDeleteShow} />
            <AddShow isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddShow={handleAddShow} />
            <UpdateShow isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedShow(null);}} showToEdit={selectedShow} onUpdateShow={handleUpdateShow} />
        </>
    )
}

export default Show;
