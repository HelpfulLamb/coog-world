import React, { useState, useEffect } from "react";
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ParkMaintenanceReport() {
    const [selectedMonth, setSelectedMonth] = useState("2025-04");
    const [rideMaintenanceData, setRideMaintenanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const [objectType, setObjectType] = useState('ride'); 
    const [maintenanceType, setMaintenanceType] = useState('both');

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    const getTotalMaintenance = () => {
        return filteredData.reduce((sum, ride) => sum + (ride.total_maintenance || 0), 0);
    };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const maxMonth = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

    const fetchParkMaintenanceData = async (month) => {
        if (!month) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/maintenance/avg-stat?month=${month}&object=${objectType}&type=${maintenanceType}`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            setRideMaintenanceData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };
    useEffect(() => {
            fetchParkMaintenanceData(selectedMonth);
        }, [selectedMonth, objectType, maintenanceType]);

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
    };

    useEffect(() => {
        let filtered = [...rideMaintenanceData];
        
        if (searchTerm) {
            filtered = filtered.filter(ride =>
                ride.object_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortOption) {
            case 'nameAsc':
              filtered.sort((a, b) => a.object_name.localeCompare(b.object_name));
              break;
            case 'nameDesc':
              filtered.sort((a, b) => b.object_name.localeCompare(a.object_name));
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
    const chartData = {
        labels: filteredData.map((item) => item.object_name), 
        datasets: [
          {
            label: 'Routine',
            data: filteredData.map((item) => item.routine_count || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Emergency',
            data: filteredData.map((item) => item.emergency_count || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
    return (
        <div className="ride-maintenance-report">
            <h2>Park Maintenance Report</h2>

            <div className="filter-controls">
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="month">Select Month:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={handleMonthChange} max={maxMonth} className="month-input" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="searchTerm">Search Ride Name:</label>
                        <input type="text" id="searchTerm" placeholder="Search by ride name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                    <div className="filter-group">
                        <label>Object Type:</label>
                        <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                            <option value="ride">Ride</option>
                            <option value="kiosk">Kiosk</option>
                            <option value="stage">Stage</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Maintenance Type:</label>
                        <select value={maintenanceType} onChange={(e) => setMaintenanceType(e.target.value)}>
                            <option value="both">Both</option>
                            <option value="routine">Routine</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner" />
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
                                    <th>{objectType.charAt(0).toUpperCase() + objectType.slice(1)} Name</th>
                                    <th>Total Maintenance</th>
                                    <th>Routine</th>
                                    <th>Emergency</th>
                                    <th>Message</th>
                                    <th>Message Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.object_name}</td>
                                        <td>{item.total_maintenance}</td>
                                        <td>{item.routine_count || 0}</td>
                                        <td>{item.emergency_count || 0}</td>
                                        <td>{item.log_message}</td>
                                        <td>{formatDate(item.log_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td><strong>{getTotalMaintenance()}</strong></td>
                                    <td><strong>{filteredData.reduce((sum, item) => sum + Number(item.routine_count || 0), 0)}</strong></td>
                                    <td><strong>{filteredData.reduce((sum, item) => sum + Number(item.emergency_count || 0), 0)}</strong></td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {!loading && !error && rideMaintenanceData.length === 0 && selectedMonth && (
                <p>No data available for the selected month.</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default ParkMaintenanceReport;