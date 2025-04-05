import { useEffect, useState } from "react";
import AddItem from "../modals/AddItem";

function ItemTable({itemInformation, setIsModalOpen}){
    if(!itemInformation || !Array.isArray(itemInformation)){
        return <div>No item data is available.</div>
    }
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Selling Price</th>
                        <th>Unit Price</th>
                    </tr>
                </thead>
                <tbody>
                    {itemInformation.map((item) => (
                        <tr key={item.Item_ID}>
                            <td>{item.Item_name}</td>
                            <td>{item.Item_type}</td>
                            <td>{item.Item_desc}</td>
                            <td>${item.Item_shop_price}</td>
                            <td>${item.Item_supply_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Item(){
    const [itemInformation, setItemInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/inventory/items');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setItemInformation(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleAddItem = (newItem) => {
        setItemInformation([...itemInformation, newItem]);
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
                <h1>Coog World Items</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Item</button>
                </div>
            </div>
            <ItemTable itemInformation={itemInformation} setIsModalOpen={setIsModalOpen} />
            <AddItem isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />
        </>
    )
}

export default Item;