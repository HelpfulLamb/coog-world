import React, { useState, useEffect } from 'react';

const TotalCostPage = () => {
    const [showEmployees, setShowEmployees] = useState(true);
    const [showInventory, setShowInventory] = useState(true);
    const [showKiosks, setShowKiosks] = useState(true);
    const [showRides, setShowRides] = useState(true);
    const [showStages, setShowStages] = useState(true);

    const [employeesData, setEmployeesData] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);
    const [kiosksData, setKiosksData] = useState([]);
    const [ridesData, setRidesData] = useState([]);
    const [stagesData, setStagesData] = useState([]);

    const formatWithCommas = (number) => {
        return new Intl.NumberFormat().format(number);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = {};

                if (showEmployees) {
                    const employeesResponse = await fetch('/api/employees/salaries');
                    data.employees = await employeesResponse.json();
                }

                if (showInventory) {
                    const inventoryResponse = await fetch('/api/inventory/cost');
                    data.inventory = await inventoryResponse.json();
                }

                if (showKiosks) {
                    const kiosksResponse = await fetch('/api/kiosks/cost');
                    data.kiosks = await kiosksResponse.json();
                }

                if (showRides) {
                    const ridesResponse = await fetch('/api/rides/cost');
                    data.rides = await ridesResponse.json();
                }

                if (showStages) {
                    const stagesResponse = await fetch('/api/stages/cost');
                    data.stages = await stagesResponse.json();
                }

                if (data.employees) setEmployeesData(data.employees);
                if (data.inventory) setInventoryData(data.inventory);
                if (data.kiosks) setKiosksData(data.kiosks);
                if (data.rides) setRidesData(data.rides);
                if (data.stages) setStagesData(data.stages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [showEmployees, showInventory, showKiosks, showRides, showStages]);

    const calculateTotalCost = (category) => {
        let total = 0;

        switch (category) {
            case 'Employees':
                total = employeesData.reduce((acc, employee) => acc + parseFloat(employee.Emp_salary || 0), 0);
                break;
            case 'Inventory':
                total = inventoryData.reduce((acc, item) => acc + parseFloat(item.Item_supply_price * item.Total_Quantity || 0), 0);
                break;
            case 'Kiosks':
                total = kiosksData.reduce((acc, kiosk) => acc + parseFloat(kiosk.Kiosk_cost || 0), 0);
                break;
            case 'Rides':
                total = ridesData.reduce((acc, ride) => acc + parseFloat(ride.Ride_cost || 0), 0);
                break;
            case 'Stages':
                total = stagesData.reduce((acc, stage) => acc + parseFloat(stage.Stage_cost || 0), 0);
                break;
            default:
                break;
        }

        return total;
    };

    const totalCost = [
        showEmployees && calculateTotalCost('Employees'),
        showInventory && calculateTotalCost('Inventory'),
        showKiosks && calculateTotalCost('Kiosks'),
        showRides && calculateTotalCost('Rides'),
        showStages && calculateTotalCost('Stages'),
    ].reduce((acc, cost) => acc + (cost || 0), 0);

    const generateRows = () => {
        const rows = [];

        if (showRides) {
            ridesData.forEach((ride) => {
                rows.push({
                    type: 'Ride',
                    name: ride.Ride_name,
                    cost: parseFloat(ride.Ride_cost).toFixed(2),
                });
            });
        }

        if (showKiosks) {
            kiosksData.forEach((kiosk) => {
                rows.push({
                    type: 'Kiosk',
                    name: kiosk.Kiosk_name,
                    cost: parseFloat(kiosk.Kiosk_cost).toFixed(2),
                });
            });
        }

        if (showStages) {
            stagesData.forEach((stage) => {
                rows.push({
                    type: 'Stage',
                    name: stage.Stage_name,
                    cost: parseFloat(stage.Stage_cost).toFixed(2),
                });
            });
        }

        if (showEmployees) {
            employeesData.forEach((employee) => {
                rows.push({
                    type: 'Employee',
                    name: `${employee.First_name} ${employee.Last_name}`,
                    cost: parseFloat(employee.Emp_salary).toFixed(2),
                });
            });
        }

        if (showInventory) {
            inventoryData.forEach((item) => {
                rows.push({
                    type: 'Inventory Item',
                    name: item.Item_name,
                    cost: (parseFloat(item.Item_supply_price) * item.Total_Quantity).toFixed(2),
                });
            });
        }

        return rows;
    };

    return (
        <div>
            <div className="filter-controls">
                <h2>Filter Cost Report</h2>
                <div className="filter-row">
                    <div className="filter-group"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                            flex: '1 1 auto',
                            marginBottom: '15px'
                        }}
                    >
                        <button
                            className="add-button"
                            onClick={() => setShowRides(!showRides)}
                            style={{
                                flex: '1 1 150px',
                                textAlign: 'center',
                                backgroundColor: showRides ? '#e74c3c' : '#3498db', 
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            {showRides ? 'Hide Ride Cost' : 'Show Ride Cost'}
                        </button>
                        <button
                            className="add-button"
                            onClick={() => setShowKiosks(!showKiosks)}
                            style={{
                                flex: '1 1 150px',
                                textAlign: 'center',
                                backgroundColor: showKiosks ? '#e74c3c' : '#3498db', 
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            {showKiosks ? 'Hide Kiosk Cost' : 'Show Kiosk Cost'}
                        </button>
                        <button
                            className="add-button"
                            onClick={() => setShowStages(!showStages)}
                            style={{
                                flex: '1 1 150px',
                                textAlign: 'center',
                                backgroundColor: showStages ? '#e74c3c' : '#3498db', 
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            {showStages ? 'Hide Stage Cost' : 'Show Stage Cost'}
                        </button>
                        <button
                            className="add-button"
                            onClick={() => setShowEmployees(!showEmployees)}
                            style={{
                                flex: '1 1 150px',
                                textAlign: 'center',
                                backgroundColor: showEmployees ? '#e74c3c' : '#3498db', 
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            {showEmployees ? 'Hide Employee Salaries' : 'Show Employee Salaries'}
                        </button>
                        <button
                            className="add-button"
                            onClick={() => setShowInventory(!showInventory)}
                            style={{
                                flex: '1 1 150px',
                                textAlign: 'center',
                                backgroundColor: showInventory ? '#e74c3c' : '#3498db', 
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            {showInventory ? 'Hide Inventory Cost' : 'Show Inventory Cost'}
                        </button>
                    </div>
                </div>
            </div>
            <h1 style={{ paddingTop: '0.5rem' }}>Coog World's Overall Cost Report</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Total Cost ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showRides && (
                            <tr>
                                <td>🎢 Rides Cost</td>
                                <td>${formatWithCommas(calculateTotalCost('Rides').toFixed(2))}</td>
                            </tr>
                        )}
                        {showKiosks && (
                            <tr>
                                <td>🛒 Kiosks Cost</td>
                                <td>${formatWithCommas(calculateTotalCost('Kiosks').toFixed(2))}</td>
                            </tr>
                        )}
                        {showStages && (
                            <tr>
                                <td>🎭 Stages Cost</td>
                                <td>${formatWithCommas(calculateTotalCost('Stages').toFixed(2))}</td>
                            </tr>
                        )}
                        {showEmployees && (
                            <tr>
                                <td>👥 Employees Salaries</td>
                                <td>${formatWithCommas(calculateTotalCost('Employees').toFixed(2))}</td>
                            </tr>
                        )}
                        {showInventory && (
                            <tr>
                                <td>📦 Inventory Cost</td>
                                <td>${formatWithCommas(calculateTotalCost('Inventory').toFixed(2))}</td>
                            </tr>
                        )}

                        <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                            <td>Total</td>
                            <td>${formatWithCommas(totalCost.toFixed(2))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Detailed Data</h3>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Cost ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateRows().map((row, index) => (
                            <tr key={index}>
                                <td>{row.type}</td>
                                <td>{row.name}</td>
                                <td>${formatWithCommas(row.cost)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TotalCostPage;
