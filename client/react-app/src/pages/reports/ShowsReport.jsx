import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../operations/Report.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PopularShows() {
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showSummaryTable, setShowSummaryTable] = useState(false);
    const [showDetailedTable, setShowDetailedTable] = useState(false);
    const [detailedData, setDetailedData] = useState([]);
    const [filteredDetailedData, setFilteredDetailedData] = useState([]);
    const [selectedShow, setSelectedShow] = useState('');
    const [showOptions, setShowOptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/shows/top-shows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters),
            });
            if (!response.ok) throw new Error('Failed to fetch show stats');
            const data = await response.json();
            setReportData(data);
            setShowOptions([...new Set(data.map(show => show.Show_name))]);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    const fetchDetailedShowLogs = async () => {
        try {
            const response = await fetch('/api/shows/show-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...filters, showName: selectedShow }),
            });
            if (!response.ok) throw new Error('Failed to fetch detailed logs');
            const data = await response.json();
            setDetailedData(data);
        } catch (err) {
            console.error('Error:', err.message);
        }
    };

    // Auto-fetch when dates change
    useEffect(() => {
        fetchReport();
    }, [filters.startDate, filters.endDate]);

    useEffect(() => {
        if (showDetailedTable) {
            fetchDetailedShowLogs();
        }
    }, [showDetailedTable, selectedShow, filters.startDate, filters.endDate]);

    useEffect(() => {
        let filtered = [...reportData];

        if (selectedShow) {
            filtered = filtered.filter(show => show.Show_name === selectedShow);
        }

        // Summary-specific sorting
        switch (sortOption) {
            case 'viewersAsc':
                filtered.sort((a, b) => a.total_viewers - b.total_viewers);
                break;
            case 'viewersDesc':
                filtered.sort((a, b) => b.total_viewers - a.total_viewers);
                break;
            case 'capacityAsc':
                filtered.sort((a, b) => a.theatre_capacity - b.theatre_capacity);
                break;
            case 'capacityDesc':
                filtered.sort((a, b) => b.theatre_capacity - a.theatre_capacity);
                break;
            case 'percentAsc':
                filtered.sort((a, b) => a.capacity_percent - b.capacity_percent);
                break;
            case 'percentDesc':
                filtered.sort((a, b) => b.capacity_percent - a.capacity_percent);
                break;
            case 'nameAsc':
                filtered.sort((a, b) => a.Show_name.localeCompare(b.Show_name));
                break;
            case 'nameDesc':
                filtered.sort((a, b) => b.Show_name.localeCompare(a.Show_name));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.late_log) - new Date(b.late_log));
                break;
            case 'latest':
                filtered.sort((a, b) => new Date(b.late_log) - new Date(a.late_log));
                break;
            default:
                break;
        }

        setFilteredData(filtered);
    }, [reportData, sortOption, selectedShow]);

    useEffect(() => {
        let data = [...detailedData];

        if (selectedShow) {
            data = data.filter(log => log.Show_name === selectedShow);
        }

        // Shared sorting options
        switch (sortOption) {
            case 'nameAsc':
                data.sort((a, b) => a.Show_name.localeCompare(b.Show_name));
                break;
            case 'nameDesc':
                data.sort((a, b) => b.Show_name.localeCompare(a.Show_name));
                break;
            case 'oldest':
                data.sort((a, b) => new Date(a.watch_date) - new Date(b.watch_date));
                break;
            case 'latest':
                data.sort((a, b) => new Date(b.watch_date) - new Date(a.watch_date));
                break;
            default:
                break;
        }

        setFilteredDetailedData(data);
    }, [detailedData, sortOption, selectedShow]);

    const chartData = {
        labels: filteredData.map(show => show.Show_name),
        datasets: [
            {
                label: 'Total Viewers',
                data: filteredData.map(show => show.total_viewers),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="ride-frequency-report">
            <h2>Popular Shows Report</h2>

            <div className="filter-controls">
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="startDate">Start Date:</label>
                        <input 
                            type="date" 
                            name="startDate" 
                            value={filters.startDate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="endDate">End Date:</label>
                        <input 
                            type="date" 
                            name="endDate" 
                            value={filters.endDate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="showFilter">Filter by Show:</label>
                        <select 
                            id="showFilter" 
                            value={selectedShow} 
                            onChange={(e) => setSelectedShow(e.target.value)}
                        >
                            <option value="">-- All Shows --</option>
                            {showOptions.map((show, idx) => (
                                <option key={idx} value={show}>{show}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sortOption">Sort By:</label>
                        <select 
                            id="sortOption" 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">-- Select Sorting --</option>
                            <option value="nameAsc">Show Name (A-Z)</option>
                            <option value="nameDesc">Show Name (Z-A)</option>
                            <option value="viewersAsc">Viewers (Low to High)</option>
                            <option value="viewersDesc">Viewers (High to Low)</option>
                            <option value="capacityAsc">Capacity (Low to High)</option>
                            <option value="capacityDesc">Capacity (High to Low)</option>
                            <option value="percentAsc">Capacity % (Low to High)</option>
                            <option value="percentDesc">Capacity % (High to Low)</option>
                            <option value="oldest">Oldest Date</option>
                            <option value="latest">Latest Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <div className="loading-overlay"><div className="spinner" /></div>}

            {!loading && filteredData.length > 0 && (
                <div className="chart-container">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}

            <div className="table-toggle-buttons">
                <button 
                    onClick={() => setShowSummaryTable(!showSummaryTable)} 
                    aria-expanded={showSummaryTable}
                >
                    {showSummaryTable ? (
                        <>
                            <span className="icon">▼</span> Hide Summary Table
                        </>
                    ) : (
                        <>
                            <span className="icon">►</span> Show Summary Table
                        </>
                    )}
                </button>
                <button 
                    onClick={() => setShowDetailedTable(!showDetailedTable)} 
                    aria-expanded={showDetailedTable}
                >
                    {showDetailedTable ? (
                        <>
                            <span className="icon">▼</span> Hide Details Table
                        </>
                    ) : (
                        <>
                            <span className="icon">►</span> Show Details Table
                        </>
                    )}
                </button>
            </div>

            {!loading && !error && showSummaryTable && filteredData.length > 0 && (
                <>
                    <h3>Show Summary</h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Show</th>
                                    <th>Stage</th>
                                    <th>Viewers</th>
                                    <th>Capacity</th>
                                    <th>Latest Log</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.Show_name}</td>
                                        <td>{row.Stage_name}</td>
                                        <td>{row.total_viewers}</td>
                                        <td>{row.theatre_capacity}</td>
                                        <td>{formatDate(row.late_log)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {!loading && !error && showDetailedTable && filteredDetailedData.length > 0 && (
                <>
                    <h3>Detailed Show Logs</h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Show</th>
                                    <th>Visitor</th>
                                    <th>Watch Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDetailedData.map((log, idx) => (
                                    <tr key={idx}>
                                        <td>{log.Show_name}</td>
                                        <td>{log.visitor_name}</td>
                                        <td>{formatDate(log.watch_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {!loading && !error && reportData.length === 0 && (
                <p>No data available for selected range.</p>
            )}

            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
}

export default PopularShows;