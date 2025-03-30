import { useState, useEffect } from "react";

function InventoryTable({inventoryInformation}){
    if(!inventoryInformation || !Array.isArray(inventoryInformation)){
        return <div>No inventory data is available.</div>
    }
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Product Name</th>
                        <th>Product Type</th>
                        <th>Quantity in Stock</th>
                        <th>Cost price per Unit</th>
                        <th>Selling price per Unit</th>
                        <th>Kiosk</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryInformation.map((inventory) => (
                        <tr key={inventory.Inventory_ID}>
                            <td>{inventory.Item_ID}</td>
                            <td>{inventory.Item_name}</td>
                            <td>{inventory.Item_type}</td>
                            <td>{inventory.Item_quantity}</td>
                            <td>${inventory.Item_supply_price}</td>
                            <td>${inventory.Item_shop_price}</td>
                            <td>{inventory.Kiosk_name}</td>
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
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    return(
        <>
            <h1>Inventory Report</h1>
            <InventoryTable inventoryInformation={inventoryInformation} />
        </>
    )
}

export default Inventory;