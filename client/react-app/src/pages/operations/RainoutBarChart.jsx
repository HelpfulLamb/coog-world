import { Bar } from "react-chartjs-2";

const RainoutBarChart = ({ filteredData }) => {
    const chartData = {
        labels: [],
        datasets: [{
            label: 'Number of Rainouts',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)', 
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    filteredData.forEach(item => {
        const monthName = new Date(item.Wtr_created).toLocaleString('default', { month: 'long' });

        if (!chartData.labels.includes(monthName)) {
            chartData.labels.push(monthName);
        }

        const monthIndex = chartData.labels.indexOf(monthName);
        if (chartData.datasets[0].data[monthIndex]) {
            chartData.datasets[0].data[monthIndex]++;
        } else {
            chartData.datasets[0].data[monthIndex] = 1;
        }
    });

    const maxRainouts = Math.max(...chartData.datasets[0].data);
    const buffer = 1;  
    const yAxisMax = maxRainouts + buffer; 

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', 
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',  
                titleColor: 'white',  
                bodyColor: 'white',  
            }
        },
        layout: {
            padding: {
                top: 20,  
                left: 20,
                right: 20,
                bottom: 20,
            }
        },
        elements: {
            bar: {
                borderRadius: 4,  
            }
        },
        scales: {
            y: {
                beginAtZero: true,  
                max: yAxisMax, 
                ticks: {
                    stepSize: 1, 
                    callback: function(value) { 
                        return value % 1 === 0 ? value : ''; 
                    }
                }
            },
        },
    };

    return (
        <div className="bar-chart" style={{ width: '80%', margin: '0 auto' }}>
            <Bar data={chartData} options={chartOptions} height={300} width={450} />
        </div>
    );
};

export default RainoutBarChart;
