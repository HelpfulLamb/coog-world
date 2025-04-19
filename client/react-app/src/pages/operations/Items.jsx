import { useEffect, useState } from "react";
import AddItem, { UpdateItem } from "../modals/AddItem";
import toast from 'react-hot-toast';

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
                                <button onClick={() => onDeleteItem(item)} className="action-btn delete-button">Delete</button>
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

    const [filteredItems, setFilteredItems] = useState([]);
    const [itemNamefilter, setItemNameFilter] = useState('');
    const [itemTypeFilter, setItemTypeFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const toastId = toast.loading('Loading items...');
                const [itemRes] = await Promise.all([fetch('/api/inventory/items')]);
                const itemsData = await itemRes.json();
                setItems(itemsData);
                toast.success('Items loaded successfully!', { id: toastId });
            } catch (error) {
                toast.error('Failed to load items.');
                setError('Failed to load items.');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const toastId = toast.loading('Loading items...');
                const response = await fetch('/api/inventory/items');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setItemInformation(data);
                toast.success('Items loaded successfully!', { id: toastId });
            } catch (error) {
                toast.error(error.message);
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
            switch (sortOption) {
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
    }, [itemInformation, itemNamefilter, itemTypeFilter, sortOption]);

    const handleAddItem = (newItem) => {
        setItemInformation([...itemInformation, newItem]);
        toast.success('Item added successfully!');
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const handleUpdateItem = (updatedItem) => {
        setItemInformation(prev => prev.map(item => item.Item_ID === updatedItem.Item_ID ? updatedItem : item));
        toast.success('Item updated successfully!');
    };

    const handleDeleteItem = (item) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this item?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            deleteItem(item);
                            toast.dismiss(t.id);
                        }}
                        className="toast-confirm"
                    >
                        Confirm
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="toast-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
        });
    };

    const deleteItem = async (item) => {
        try {
            const toastId = toast.loading('Deleting item...');
            const response = await fetch('/api/inventory/delete-selected-item', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Item_ID: item.Item_ID}),
            });
            
            if(response.ok){
                toast.success('Item deleted successfully!', { id: toastId });
                setItemInformation(prev => prev.filter(i => i.Item_ID !== item.Item_ID));
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete item.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const resetFilters = () => {
        setItemNameFilter('');
        setItemTypeFilter('');
        setSortOption('');
        toast.success('Filters reset successfully!');
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error}</div>;

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
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
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
            <ItemTable 
                itemInformation={filteredItems} 
                setIsModalOpen={setIsModalOpen} 
                onEditItem={handleEditItem} 
                onDeleteItem={handleDeleteItem} 
            />
            <AddItem 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddItem={handleAddItem} 
            />
            <UpdateItem 
                isOpen={isEditOpen} 
                onClose={() => {
                    setIsEditOpen(false); 
                    setSelectedItem(null);
                }} 
                itemToEdit={selectedItem} 
                onUpdateItem={handleUpdateItem} 
            />
        </>
    )
}

export default Item;