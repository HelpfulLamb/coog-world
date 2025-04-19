import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PopularShows(){
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });
    const [reportData, setReportData] = useState([]);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };
    const fetchReport = async () => {
        try {
            const response = await fetch('/api/shows/top-shows', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(filters),
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report: ', error);
        }
    };
    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: ''
        });
        setReportData([]);
    };
    const chartData = {
        labels: reportData.map(show => show.Show_name),
        datasets: [
            {
                label: 'Total Viewers',
                data: reportData.map(show => show.total_viewers),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
        ]
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Total Viewers by Show' }
        }
    };

    //For date formatting
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <>
            <div>
                <h2>Top Shows</h2>
                <div className="filter-controls">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                </div>
                <button onClick={fetchReport}>Generate Report</button>
                <button onClick={clearFilters}>Clear</button>
                {reportData.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Show Name</th>
                                <th>Stage Name</th>
                                <th>Total Viewers</th>
                                <th>Capacity</th>
                                <th>Capacity Percent</th>
                                <th>Latest Log</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Show_name}</td>
                                        <td>{row.Stage_name}</td>
                                        <td>{row.total_viewers}</td>
                                        <td>{row.theatre_capacity}</td>
                                        <td>{row.capacity_percent}</td>
                                        <td>{formatDate(row.late_log)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No Results Found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PopularShows;