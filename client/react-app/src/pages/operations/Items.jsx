import { useEffect, useState } from "react";
import AddItem, { UpdateItem } from "../modals/AddItem";

function ItemTable({itemInformation, setIsModalOpen, onEditItem, onDeleteItem}){
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
                        <th></th>
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
                            <td>
                                <button onClick={() => onEditItem(item)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteItem(item.Item_ID)} className="action-btn delete-button">Delete</button>
                            </td>
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

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [filteredItems, setFilteredItems] = useState('');
    const [itemNamefilter, setItemNameFilter] = useState('');
    const [itemTypeFilter, setItemTypeFilter] = useState('');
    const [sortOPtion, setSortOption] = useState('');

    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemRes] = await Promise.all([fetch('/api/inventory/items')]);
                const itemsData = await itemRes.json();
                setItems(itemsData);
            } catch (error) {
                setMessage({ error: 'Failed to load items.', success: '' });
            }
        }
        fetchData();
    }, []);

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

    useEffect(() => {
        let filtered = [...itemInformation];
        if(itemNamefilter){
            filtered = filtered.filter(item => item.Item_name.toLowerCase().includes(itemNamefilter.toLowerCase()));
        }
        if(itemTypeFilter){
            filtered = filtered.filter(item => item.Item_type.toLowerCase().includes(itemTypeFilter.toLowerCase()));
        }
        filtered.sort((a,b) => {
            switch (sortOPtion) {
                case 'nameAsc':
                    return a.Item_name.localeCompare(b.Item_name);
                case 'nameDesc':
                    return b.Item_name.localeCompare(a.Item_name);
                case 'supplyAsc':
                    return a.Item_supply_price - b.Item_supply_price;
                case 'supplyDesc':
                    return b.Item_supply_price - a.Item_supply_price;
                case 'sellAsc':
                    return a.Item_shop_price - b.Item_shop_price;
                case 'sellDesc':
                    return b.Item_shop_price - a.Item_shop_price;
                default:
                    return 0;
            }
        });
        setFilteredItems(filtered);
    }, [itemInformation, itemNamefilter, itemTypeFilter, sortOPtion]);

    const handleAddItem = (newItem) => {
        setItemInformation([...itemInformation, newItem]);
    };
    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };
    const handleUpdateItem = (updatedItem) => {
        setItemInformation(prev => prev.map(item => item.Item_ID === updatedItem.Item_ID ? updatedItem : item));
    };
    const handleDeleteItem = async (itemID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
        if(!confirmDelete) return;
        try {
            const response = await fetch('/api/inventory/delete-selected-item', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Item_ID: itemID}),
            });
            const data = await response.json();
            if(response.ok){
                alert('Item deleted successfully!');
                setItemInformation(prev => prev.filter(item => item.Item_ID !== itemID));
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                alert(data.message || 'Failed to delete item.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    const resetFilters = () => {
        setItemNameFilter('');
        setItemTypeFilter('');
        setSortOption('');
    };
    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }

    return(
        <>
            <div className="filter-controls">
                <h2>Filter Items</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="itemName">Item Name:</label>
                        <select type="text" id="itemName" value={itemNamefilter} onChange={(e) => setItemNameFilter(e.target.value)}>
                            <option value="">-- Select an Item --</option>
                            {items.map(item => (
                                <option key={item.Item_ID} value={item.Item_name}>{item.Item_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="itemType">Item Type:</label>
                        <select id="itemType" value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)}>
                            <option value="">-- Select a Type --</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Toy">Toy</option>
                            <option value="Souvenirs">Souvenirs</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Food">Food</option>
                            <option value="Drink">Drink</option>
                            <option value="Collectible">Collectible</option>
                            <option value="Prize">Prize</option>
                            <option value="Seasonal">Seasonal</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOPtion} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Sort Method --</option>
                            <option value="nameAsc">Item Name (A-Z)</option>
                            <option value="nameDesc">Item Name (Z-A)</option>
                            <option value="supplyAsc">Unit Price (Low to High)</option>
                            <option value="supplyDesc">Unit Price (High to Low)</option>
                            <option value="sellAsc">Sell Price (Low to High)</option>
                            <option value="sellDesc">Sell Price (High to Low)</option>
                        </select>
                    </div>
                    <button onClick={resetFilters} className="reset-button">Reset Filters</button>
                </div>
            </div>
            <div className="db-btn">
                <h1>Coog World Items</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Item</button>
                </div>
            </div>
            <ItemTable itemInformation={filteredItems} setIsModalOpen={setIsModalOpen} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
            <AddItem isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />
            <UpdateItem isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedItem(null);}} itemToEdit={selectedItem} onUpdateItem={handleUpdateItem} />
        </>
    )
}

export default Item;