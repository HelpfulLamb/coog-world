import { useEffect, useState } from "react";
import AddMaintenance from "../modals/AddMaintenance.jsx";

function MaintenanceTable({maintenanceInformation, setIsModalOpen, onStatusChange}){
    
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
                        <th>Object</th>
                        <th>Object Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceInformation.map((maintenance) => (
                        <tr key={maintenance.MaintID}>
                            <td>{formatDate(maintenance.Maintenance_Date)}</td>
                            <td>${Number(maintenance.Maint_cost).toLocaleString()}</td>
                            <td>{maintenance.Maint_Type}</td>
                            <td>{maintenance.Maint_obj}</td>
                            <td>{maintenance.Maint_obj_name}</td>
                            <td>{maintenance.Maint_Status}</td>
                            <td>
                                {maintenance.Maint_Status !== 'Completed' && (
                                    <>
                                        <button onClick={() => onStatusChange(maintenance.MaintID, 'In Progress', maintenance.Maint_obj, maintenance.Maint_obj_ID)} className="action-btn edit-button">In Progess</button>
                                        <button onClick={() => onStatusChange(maintenance.MaintID, 'Completed', maintenance.Maint_obj, maintenance.Maint_obj_ID)} className="action-btn delete-button">Complete</button>
                                    </>
                                )}
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
    const handleAddMaintenance = (newMaintenance) => {
        setMaintenanceInformation([...maintenanceInformation, newMaintenance]);
    };
    const handleStatusUpdate = async (MaintID, Maint_Status, Maint_obj, Maint_obj_ID) => {
        const confirmStatus = window.confirm(`Mark this status as '${Maint_Status}'?`);
        if(!confirmStatus) return;
        try {
            const response = await fetch(`/api/maintenance/status/${MaintID}`,{
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Maint_Status, Maint_obj, Maint_obj_ID}),
            });
            const data = await response.json();
            if(response.ok){
                alert(`Maintenance status has been marked as '${Maint_Status}'!`);
                setMaintenanceInformation(prev => prev.filter(maint => maint.MaintID !== MaintID));
                setTimeout(() => {window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to update maintenance status.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <div className="db-btn">
                <h1>Maintenance Report</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Report Maintenance</button>
                </div>
            </div>
            <MaintenanceTable maintenanceInformation={maintenanceInformation} setIsModalOpen={setIsModalOpen} onStatusChange={handleStatusUpdate} />
            <AddMaintenance isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddMaintenance={handleAddMaintenance} />
        </>
    )
}
export default Maintenance;