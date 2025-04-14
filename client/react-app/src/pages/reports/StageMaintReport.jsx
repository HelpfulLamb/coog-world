import React, { useEffect, useState } from 'react';
import {Bar} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StageBreakdown() {
    const [data, setData] = useState([]);
    const fetchMalfunction = async () => {
        try {
            const response = await fetch('/api/maintenance/stage-breakdowns');
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
        labels: data.map(row => row.Stage_name),
        datasets: [
            {
                label: 'Number of Breakdowns',
                data: data.map(row => row.emergency_count),
                backgroundColor: 'rgba(154, 99, 255, 0.5)',
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Malfunctions Per Stage' },
        },
    };
    return (
        <div>
            <h2>Stage Breakdowns</h2>
            <button onClick={fetchMalfunction}>Generate Report</button>
            <div className='table-container'>
                {data.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Stage Name</th>
                            <th>Emergencies</th>
                            <th>Last Emergency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Stage_name}</td>
                                    <td>{row.emergency_count}</td>
                                    <td>{formatDate(row.last_emergency_date)}</td>
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
    );
}

export default StageBreakdown;
