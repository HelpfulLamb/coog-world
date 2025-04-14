import React, { useEffect, useState } from 'react';
import {Bar} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function RideBreakdown() {
    const [data, setData] = useState([]);
    const fetchBreakdown = async () => {
        try {
            const response = await fetch('/api/maintenance/ride-breakdowns');
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching report: ', error);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const chartData = {
        labels: data.map(row => row.Ride_name),
        datasets: [
            {
                label: 'Number of Breakdowns',
                data: data.map(row => row.num_breakdowns),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Breakdowns per Ride' },
        },
    };
    return (
        <>
            <div>
                <h2>Ride Breakdowns</h2>
                <button onClick={fetchBreakdown}>Generate Report</button>
                <div className='table-container'>
                    {data.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    )}
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Breakdowns</th>
                                <th>Last Breakdown</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Ride_name}</td>
                                        <td>{row.num_breakdowns}</td>
                                        <td>{formatDate(row.last_breakdown_date)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default RideBreakdown;
