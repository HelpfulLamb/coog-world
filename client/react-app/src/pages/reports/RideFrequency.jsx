import React, { useEffect, useState } from "react";
import '../operations/Report.css';
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function RideFrequencyReport() {
    const [selectedMonth, setSelectedMonth] = useState("2025-04");
    const [rideFrequencyData, setRideFrequencyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showSummaryTable, setShowSummaryTable] = useState(false);
    const [showDetailedTable, setShowDetailedTable] = useState(false);
    const [detailedData, setDetailedData] = useState([]);
    const [detailedLoading, setDetailedLoading] = useState(false);
    const [filteredDetailedData, setFilteredDetailedData] = useState([]);
    const [selectedRide, setSelectedRide] = useState('');
    const [rideOptions, setRideOptions] = useState([]);

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
            // Extract unique ride names for dropdown
            const rides = [...new Set(data.map(item => item.ride_name))];
            setRideOptions(rides);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    const fetchDetailedRideLogs = async (month, rideName) => {
        setDetailedLoading(true);
        try {
            const query = `/api/rides/ride-details?month=${month}${rideName ? `&rideName=${rideName}` : ''}`;
            const response = await fetch(query);
            if (!response.ok) throw new Error("Failed to fetch detailed ride logs");
            const data = await response.json();
            setDetailedData(data);
        } catch (err) {
            console.error("Error fetching detailed logs:", err.message);
        } finally {
            setDetailedLoading(false);
        }
    };

    useEffect(() => {
        fetchRideFrequencyData(selectedMonth);
    }, [selectedMonth]);

    useEffect(() => {
        if(showDetailedTable){
            fetchDetailedRideLogs(selectedMonth, selectedRide || searchTerm);
        }
    }, [selectedMonth, searchTerm, showDetailedTable, sortOption, selectedRide]);

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
    };

    const handleRideChange = (event) => {
        setSelectedRide(event.target.value);
    };

    useEffect(() => {
        let filtered = [...rideFrequencyData];
        
        // Apply ride filter if selected
        if (selectedRide) {
            filtered = filtered.filter(ride => 
                ride.ride_name === selectedRide
            );
        }
        
        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter(ride =>
                ride.top_rider.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply sorting
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
            case 'oldest':
                filtered.sort((a,b) => new Date(a.ride_date) - new Date(b.ride_date));
                break;
            case 'latest':
                filtered.sort((a,b) => new Date(b.ride_date) - new Date(a.ride_date));
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
    }, [rideFrequencyData, searchTerm, sortOption, selectedRide]);

    useEffect(() => {
        let data = [...detailedData];
        if (searchTerm) {
            data = data.filter(log =>
                log.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.Ride_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedRide) {
            data = data.filter(log => 
                log.Ride_name === selectedRide
            );
        }
        switch (sortOption) {
            case 'nameAsc':
                data.sort((a, b) => a.Ride_name.localeCompare(b.Ride_name));
                break;
            case 'nameDesc':
                data.sort((a, b) => b.Ride_name.localeCompare(a.Ride_name));
                break;
            case 'oldest':
                data.sort((a, b) => new Date(a.ride_date) - new Date(b.ride_date));
                break;
            case 'latest':
                data.sort((a, b) => new Date(b.ride_date) - new Date(a.ride_date));
                break;
            default:
                break;
        }
        setFilteredDetailedData(data);
    }, [detailedData, searchTerm, sortOption, selectedRide]);

    const chartData = {
        labels: filteredData.map((ride) => ride.ride_name),
        datasets: [
          {
            label: 'Total Rides This Month',
            data: filteredData.map((ride) => ride.total_rides),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: "Top Rider's Count",
            data: filteredData.map((ride) => ride.top_rides),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          }
        ]
      };
      
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

    //For date formatting
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

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
                        <label htmlFor="rideFilter">Filter by Ride:</label>
                        <select 
                            id="rideFilter" 
                            value={selectedRide} 
                            onChange={handleRideChange}
                        >
                            <option value="">-- All Rides --</option>
                            {rideOptions.map((ride, index) => (
                                <option key={index} value={ride}>{ride}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sortOption">Sort By:</label>
                        <select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Select Sorting --</option>
                            <option value="nameAsc">Ride Name (A-Z) (Both)</option>
                            <option value="nameDesc">Ride Name (Z-A) (Both)</option>
                            <option value="timesRiddenAsc">Times Ridden (Low to High) (Summary)</option>
                            <option value="timesRiddenDesc">Times Ridden (High to Low) (Summary)</option>
                            <option value="oldest">Oldest Date Ridden (Detailed)</option>
                            <option value="latest">Latest Date Ridden (Detailed)</option>
                            <option value="topRiderCountAsc">Top Rider's Count (Low to High) (Summary)</option>
                            <option value="topRiderCountDesc">Top Rider's Count (High to Low) (Summary)</option>
                        </select>
                    </div>
                </div>
            </div>


            <div className="table-wrapper">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner">
                        </div>
                    </div>
                )}
                {!loading && filteredData.length > 0 && (
                    <div className="chart-container" style={{ marginTop: '2rem' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
                <div className="table-toggle-buttons">
                    <button onClick={() => setShowSummaryTable(!showSummaryTable)} aria-expanded={showSummaryTable}>
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
                    <button onClick={() => setShowDetailedTable(!showDetailedTable)} aria-expanded={showDetailedTable}>
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
                        <h3>Ride Log Summary</h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Ride Name</th>
                                        <th>Times Ridden</th>
                                        <th>Top Rider</th>
                                        <th>Top Rider's Count</th>
                                        <th>Latest Log</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((ride, index) => (
                                        <tr key={index}>
                                            <td>{ride.ride_name}</td>
                                            <td>{ride.total_rides}</td>
                                            <td>{ride.top_rider}</td>
                                            <td>{ride.top_rides}</td>
                                            <td>{formatDate(ride.late_log)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {!loading && !error && showDetailedTable && filteredDetailedData.length > 0 && (
                    <>
                        <h3>Detailed Ride Log</h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Ride Name</th>
                                        <th>Visitor Name</th>
                                        <th>Ride Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDetailedData.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.Ride_name}</td>
                                            <td>{log.visitor_name}</td>
                                            <td>{formatDate(log.ride_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {!loading && !error && rideFrequencyData.length === 0 && selectedMonth && (
                <p>No data available for the selected month.</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default RideFrequencyReport;