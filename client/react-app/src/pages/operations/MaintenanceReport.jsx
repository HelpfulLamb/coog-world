import { useEffect, useState } from "react";
import AddBreakdown from "../modals/AddBreakdown";

function MaintenanceTable({maintenanceInformation, setIsModalOpen}){
    if(!maintenanceInformation || !Array.isArray(maintenanceInformation)){
        return <div>No maintenance data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
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
            <div>
                <button className="add-button" onClick={() => setIsModalOpen(true)}>Report Maintenance</button>
            </div>
        </div>
    );
}

function Maintenance(){
    const [maintenanceInformation, setMaintenanceInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    const handleAddBreakdown = (newBreakdown) => {
        setMaintenanceInformation([...maintenanceInformation, newBreakdown]);
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Coog World Maintenance</h1>
            <MaintenanceTable maintenanceInformation={maintenanceInformation} setIsModalOpen={setIsModalOpen} />
            <AddBreakdown isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBreakdown={handleAddBreakdown} />
        </>
    )
}

export default Maintenance;