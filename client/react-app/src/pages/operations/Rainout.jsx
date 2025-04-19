import { useState, useEffect } from "react";
import RainoutBarChart from "./RainoutBarChart.jsx"; // Import the chart component

function RainoutReport() {
    const [rainoutData, setRainoutData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // Fetch the rainout data
    useEffect(() => {
        const fetchRainouts = async () => {
            try {
                const response = await fetch("/api/reports/rainout-rows"); // Make sure the API endpoint is correct
                if (!response.ok) {
                    throw new Error("Failed to fetch rainout data");
                }
                const data = await response.json();
                setRainoutData(data);
                setFilteredData(data); // Initialize filtered data with all rainouts
            } catch (err) {
                console.error("Error fetching rainout data:", err);
                setError("Failed to fetch rainout data");
            } finally {
                setLoading(false);
            }
        };

        fetchRainouts();
    }, []);

    // Filter rainout data based on selected filters
    useEffect(() => {
        let filtered = [...rainoutData];

        // Filter by weather condition
        if (selectedCondition) {
            filtered = filtered.filter(item => item.Wtr_cond === selectedCondition);
        }

        // Filter by year (based on Wtr_created date)
        if (selectedYear && !selectedMonth) {
            filtered = filtered.filter(item => {
                return new Date(item.Wtr_created).getFullYear() === Number(selectedYear)});
        }

        // Filter by month (based on Wtr_created date)
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-').map(Number);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.Wtr_created);
                return itemDate.getFullYear() === year && itemDate.getMonth() + 1 === month;
            });
        }

        setFilteredData(filtered);
    }, [selectedCondition, selectedYear, selectedMonth, rainoutData]);

    const resetFilters = () => {
        setSelectedCondition("");
        setSelectedYear("");
        setSelectedMonth("");
    };


    // Generate months and ensure they are sorted (from 1 to 12)
    const uniqueMonths = [...new Set(rainoutData.map(item => new Date(item.Wtr_created).getMonth() + 1))];  // Months are 0-indexed
    uniqueMonths.sort((a, b) => a - b); // Ensure months are sorted from 1 to 12


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="filter-controls">
                <h2>Filter Rainout Data</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="Wtr_cond">Weather Condition:</label>
                        <select
                            name="Wtr_cond"
                            id="Wtr_cond"
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                            <option value="">-- Select a Condition --</option>
                            <option value="Windy">Windy</option>
                            <option value="Rain">Rain</option>
                            <option value="Stormy">Stormy</option>
                            <option value="Snow">Snow</option>
                            <option value="Hurricane">Hurricane</option>
                            <option value="Tornado">Tornado</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="year">Year:</label>
                        <input type="number" id="year" value={selectedYear} min='2000' max={new Date().getFullYear()} onChange={(e) => setSelectedYear(e.target.value)} placeholder="e.g. 2025" />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="month">Month:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                    </div>
                </div>

                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>
                        Reset Filters
                    </button>
                </div>
            </div>
            
            {/* Pass filtered data to the RainoutBarChart */}
            <RainoutBarChart filteredData={filteredData} />

            {/* Render the Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Condition</th>
                            <th>Level</th>
                            <th>Park Closed</th>
                            <th>Tickets Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((entry, index) => (
                                <tr key={index}>
                                    <td>{new Date(entry.Wtr_created).toLocaleDateString()}</td>
                                    <td>{entry.Wtr_cond}</td>
                                    <td>{entry.Wtr_level}</td>
                                    <td>{entry.Is_park_closed ? "Yes" : "No"}</td>
                                    <td>{entry.Tickets_sold}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No matching data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RainoutReport;