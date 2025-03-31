import { useEffect, useState } from "react";

function MaintenanceTable({maintenanceInformation}){
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <>
        {!maintenanceInformation || maintenanceInformation.length === 0 ? (
            <div className="data-missing-msg">No maintenance information is currently available.</div>
        ) : (
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date Reported</th>
                            <th>Maintenance Cost</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceInformation.map((maintenance) => (
                            <tr key={maintenance.MaintID}>
                                <td>{formatDate(maintenance.Maintenance_Date)}</td>
                                <td>${Number(maintenance.Maint_cost).toLocaleString()}</td>
                                <td>{maintenance.Maint_Type}</td>
                                <td>{maintenance.Maint_Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        <div>
            <button className="add-button">Report Maintenance</button>
        </div>
        </>
    );
}

function Maintenance(){
    const [maintenanceInformation, setMaintenanceInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                const response = await fetch('/api/maintenance/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMaintenanceInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMaintenance();
    }, []);
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Maintenance Report</h1>
            <MaintenanceTable maintenanceInformation={maintenanceInformation} />
        </>
    )
}

export default Maintenance;