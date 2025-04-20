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

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const maxMonth = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

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
            setTimeout(() => setLoading(false), 300);
        }
    };
    useEffect(() => {
        fetchRideFrequencyData(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
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
                {!loading && !error && filteredData.length > 0 && (
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