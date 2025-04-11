import { useState, useEffect } from "react";
import RainoutBarChart from "./RainoutBarChart.jsx";

function RainoutTable({ rainoutData }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (!rainoutData || !Array.isArray(rainoutData)) {
        return <div>No rainout data is currently available.</div>;
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Condition</th>
                        <th>Level</th>
                        <th>Park Closed</th>
                    </tr>
                </thead>
                <tbody>
                    {rainoutData.map((entry, index) => (
                        <tr key={index}>
                            <td>{formatDate(entry.Wtr_created)}</td>
                            <td>{entry.Wtr_cond}</td>
                            <td>{entry.Wtr_level}</td>
                            <td>{entry.Is_park_closed ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RainoutReport() {
    const [rainoutData, setRainoutData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRainouts = async () => {
            try {
                const response = await fetch('/api/reports/rainout-rows');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setRainoutData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRainouts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="db-btn">
                <h1>Rainout Report</h1>
            </div>
            <RainoutBarChart />
            <RainoutTable rainoutData={rainoutData} />
        </>
    );
}

export default RainoutReport;