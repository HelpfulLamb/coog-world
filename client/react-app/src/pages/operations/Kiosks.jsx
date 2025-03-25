import AddKiosk from "../modals/AddKiosk";
import './Kiosk.css';
import { useEffect, useState } from "react";

function KioskTable({kioskInformation, setIsModalOpen}){
    if(!kioskInformation || !Array.isArray(kioskInformation)){
        return <div>No kiosk data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    return(
        <div className="kiosk-table-container">
            <table className="kiosk-table">
                <thead>
                    <tr>
                        <th>Kiosk ID</th>
                        <th>Kiosk Name</th>
                        <th>Kiosk Type</th>
                        <th>Location</th>
                        <th>Cost</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {kioskInformation.map((kiosk) => (
                        <tr key={kiosk.Kiosk_ID}>
                            <td>{kiosk.Kiosk_ID}</td>
                            <td>{kiosk.Kiosk_name}</td>
                            <td>{kiosk.Kiosk_type}</td>
                            <td>{kiosk.area_name}</td>
                            <td>${Number(kiosk.Kiosk_cost).toLocaleString()}</td>
                            <td>{formatDate(kiosk.Kiosk_created)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button className="add-kiosk-button" onClick={() => setIsModalOpen(true)}>Add Kiosk</button>
            </div>
        </div>
    );
}

function Kiosk(){
    const [kioskInformation, setKioskInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchKiosk = async () => {
            try {
                const response = await fetch('http://localhost:3305/api/kiosks/info');
            } catch (error) {
                
            }
        };
    }, []);

    return(
        <>
            <h1>Coog World Kiosks</h1>
            <p>This is where information of Shops and Booths will be displayed.</p>
        </>
    )
}

export default Kiosk;