import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function RainoutBarChart() {
  const [rainoutData, setRainoutData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRainouts = async () => {
      try {
        const response = await fetch("/api/reports/rainouts");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRainoutData(data);
      } catch (err) {
        console.error("Error fetching rainout data:", err);
        setError("Failed to fetch rainout data");
      } finally {
        setLoading(false);
      }
    };

    fetchRainouts();
  }, []);

  const filteredData = rainoutData.filter(item => item.year === Number(year));
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: `Rainouts in ${year}`,
        data: Array(12).fill(0).map((_, i) => {
          const match = filteredData.find(item => item.month === i + 1);
          return match ? match.rainouts : 0;
        }),
        backgroundColor: "#4a90e2",
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: 'black' }, 
      },
      x: {
        ticks: { color: 'black' }, 
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black' 
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'black', 
        bodyColor: 'black' 
      }
    },
    elements: {
      bar: {
        borderWidth: 1, 
      },
    },
    layout: {
      padding: 10
    },
    backgroundColor: 'white', 
  };

  useEffect(() => {
    const canvas = document.querySelector(".chart-container canvas");
    if (canvas) {
      canvas.style.backgroundColor = 'white';
    }
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <h2>Rainouts Per Month</h2>
      <label>
        Select Year:&nbsp;
        <select value={year} onChange={e => setYear(e.target.value)}>
          {[...new Set((rainoutData || []).map(d => d.year))].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      <Bar data={barData} options={options} />
    </div>
  );
}

export default RainoutBarChart;
