import AddShow from "../modals/AddShow";
import './Report.css';
import { useState, useEffect } from "react";

function ShowTable({showInformation, setIsModalOpen}){
    if(!showInformation || !Array.isArray(showInformation)){
        return <div>No show data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const calculateDuration = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const startTotalMin = startHour * 60 + startMinute;
        const endTotalMin = endHour * 60 + endMinute;
        const diffMin = endTotalMin - startTotalMin;
        const hours = Math.floor(diffMin / 60);
        const minutes = diffMin % 60;
        return `${hours}h ${minutes}min`;
    };
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Show Name</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>Total Performers</th>
                        <th>Date Performed</th>
                        <th>Show Cost</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {showInformation.map((show) =>(
                        <tr key={show.Show_ID}>
                            <td>{show.Show_name}</td>
                            <td>{show.Stage_name}</td>
                            <td>{calculateDuration(show.Show_start, show.Show_end)}</td>
                            <td>{show.Perf_num}</td>
                            <td>{formatDate(show.Show_date)}</td>
                            <td>${Number(show.Show_cost).toLocaleString()}</td>
                            <td>{formatDate(show.Show_created)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Show(){
    const [showInformation, setShowInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await fetch('/api/shows/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setShowInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
    }, []);

    const handleAddShow = (newShow) => {
        setShowInformation([...showInformation, newShow]);
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
                <h1>Coog World Shows</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Show</button>
                </div>
            </div>
            <ShowTable showInformation={showInformation} setIsModalOpen={setIsModalOpen} />
            <AddShow isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddShow={handleAddShow} />
        </>
    )
}

export default Show;
