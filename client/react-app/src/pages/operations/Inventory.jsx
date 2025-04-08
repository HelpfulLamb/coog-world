import { useState, useEffect } from "react";
import AssignItem from "../modals/AssignItem";

function InventoryTable({inventoryInformation, setIsModalOpen, onDeleteInventory}){
    if(!inventoryInformation || !Array.isArray(inventoryInformation)){
        return <div>No inventory data is available.</div>
    }
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Type</th>
                        <th>Quantity in Stock</th>
                        <th>Cost price per Unit</th>
                        <th>Selling price per Unit</th>
                        <th>Kiosk</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryInformation.map((inventory) => (
                        <tr key={inventory.Inventory_ID}>
                            <td>{inventory.Item_name}</td>
                            <td>{inventory.Item_type}</td>
                            <td>{inventory.Item_quantity}</td>
                            <td>${inventory.Item_supply_price}</td>
                            <td>${inventory.Item_shop_price}</td>
                            <td>{inventory.Kiosk_name}</td>
                            <td>
                                <button className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteInventory(inventory.Inventory_ID)} className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Inventory(){
    const [inventoryInformation, setInventoryInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch('/api/inventory/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setInventoryInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);
    const handleAssignItem = (newAssignment) => {
        setInventoryInformation([...inventoryInformation, newAssignment]);
    };
    const handldeDeleteInventory = async (invID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/inventory/delete-selected',{
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Inventory_ID: invID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Assignment deleted successfully!');
                setInventoryInformation(prev => prev.filter(inv => inv.Inventory_ID !== invID));
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to delete item assignment.');
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
                <h1>Inventory</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Assign Item</button>
                </div>
            </div>
            <InventoryTable inventoryInformation={inventoryInformation} setIsModalOpen={setIsModalOpen} onDeleteInventory={handldeDeleteInventory} />
            <AssignItem isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAssignItem={handleAssignItem} />
        </>
    )
}

export default Inventory;