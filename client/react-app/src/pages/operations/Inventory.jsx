import { useState, useEffect } from "react";
import { AssignItem, RestockItem } from "../modals/AddItem";
import toast from 'react-hot-toast';

function InventoryTable({inventoryInformation, setIsModalOpen, onRestockItem, onDeleteInventory}){
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
                                <button onClick={() => onRestockItem(inventory)} className="action-btn edit-button">Restock</button>
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

    const [filteredItems, setFilteredItems] = useState([]);
    const [itemNameFilter, setItemNameFilter] = useState('');
    const [itemTypeFilter, setItemTypeFilter] = useState('');
    const [itemLocationFilter, setItemLocationFilter] = useState('');
    const [quantityRangeFilter, setQuantityRangeFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const [items, setItems] = useState([]);
    const [kiosks, setKiosks] = useState([]);

    //Restock
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [itemToRestock, setItemToRestock] = useState(null);

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
                toast.error(`Failed to load inventory: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    useEffect(() => {
        let filtered = [...inventoryInformation];
        if(itemNameFilter){
            filtered = filtered.filter(inv => inv.Item_name.toLowerCase().includes(itemNameFilter.toLowerCase()));
        }
        if(itemTypeFilter){
            filtered = filtered.filter(inv => inv.Item_type.toLowerCase().includes(itemTypeFilter.toLowerCase()));
        }
        if(itemLocationFilter){
            filtered = filtered.filter(inv => inv.Kiosk_name.toLowerCase().includes(itemLocationFilter.toLowerCase()));
        }
        if(quantityRangeFilter){
            const [min, max] = quantityRangeFilter.split('-').map(Number);
            filtered = filtered.filter(inv => {
                const stock = Number(inv.Item_quantity);
                return stock >= min && (isNaN(max) || stock <= max);
            });
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'iNameAsc':
                    return a.Item_name.localeCompare(b.Item_name);
                case 'iNameDesc':
                    return b.Item_name.localeCompare(a.Item_name);
                case 'kNameAsc':
                    return a.Kiosk_name.localeCompare(b.Kiosk_name);
                case 'kNameDesc':
                    return b.Kiosk_name.localeCompare(a.Kiosk_name);
                case 'quantAsc':
                    return a.Item_quantity - b.Item_quantity;
                case 'quantDesc':
                    return b.Item_quantity - a.Item_quantity;            
                default:
                    return 0;
            }
        });
        setFilteredItems(filtered);
    }, [inventoryInformation, itemNameFilter, itemTypeFilter, itemLocationFilter, quantityRangeFilter, sortOption]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemRes, kioskRes] = await Promise.all([
                    fetch('/api/inventory/items'), 
                    fetch('/api/kiosks')
                ]);
                const itemsData = await itemRes.json();
                const kioskData = await kioskRes.json();
                setItems(itemsData);
                setKiosks(kioskData);
            } catch (error) {
                toast.error('Failed to load items or kiosks.');
            }
        }
        fetchData();
    }, []);

    const handleAssignItem = (newAssignment) => {
        setInventoryInformation([...inventoryInformation, newAssignment]);
        toast.success('Item assigned successfully!');
    };

    const handleDeleteInventory = async (invID) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this assignment?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            deleteInventoryItem(invID);
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

    const deleteInventoryItem = async (invID) => {
        try {
            const toastId = toast.loading('Deleting inventory assignment...');
            const response = await fetch('/api/inventory/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Inventory_ID: invID}),
            });
            const data = await response.json();
            
            if(response.ok){
                toast.success('Assignment deleted successfully!', { id: toastId });
                setInventoryInformation(prev => prev.filter(inv => inv.Inventory_ID !== invID));
            } else {
                toast.error(data.message || 'Failed to delete item assignment.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleRestockItem = (item) => {
        setItemToRestock(item);
        setIsRestockModalOpen(true);
    };

    const resetFilters = () => {
        setItemNameFilter('');
        setItemTypeFilter('');
        setItemLocationFilter('');
        setQuantityRangeFilter('');
        setSortOption('');
        toast.success('Filters reset successfully!');
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
                <h2>Filter Inventory</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="Item_name">Item Name:</label>
                        <select name="Item_name" id="Item_name" value={itemNameFilter} onChange={(e) => setItemNameFilter(e.target.value)}>
                            <option value="">-- Select an Item --</option>
                            {items.map(item => (
                                <option key={item.Item_ID} value={item.Item_name}>{item.Item_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="Kiosk_name">Kiosk:</label>
                        <select name="Kiosk_name" id="Kiosk_name" value={itemLocationFilter} onChange={(e) => setItemLocationFilter(e.target.value)}>
                            <option value="">-- Select a Kiosk --</option>
                            {kiosks.map(kiosk => (
                                <option key={kiosk.Kiosk_ID} value={kiosk.Kiosk_name}>{kiosk.Kiosk_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="Item_type">Type:</label>
                        <select id="Item_type" value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)}>
                            <option value="">-- Product Type --</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Toy">Toy</option>
                            <option value="Souvenirs">Souvenirs</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Food">Food</option>
                            <option value="Drink">Drink</option>
                            <option value="Collectible">Collectible</option>
                            <option value="Prize">Prize</option>
                            <option value="Seasonal">Seasonal</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Sort Method --</option>
                            <option value="iNameAsc">Item Name (A-Z)</option>
                            <option value="iNameDesc">Item Name (Z-A)</option>
                            <option value="kNameAsc">Kiosk Name (A-Z)</option>
                            <option value="kNameDesc">Kiosk Name (Z-A)</option>
                            <option value="quantAsc">Stock (Low to High)</option>
                            <option value="quantDesc">Stock (High to Low)</option>
                        </select>
                    </div>
                </div>
                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Inventory</h1>
                <div>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>Assign Item</button>
                </div>
            </div>
            <InventoryTable 
                inventoryInformation={filteredItems} 
                setIsModalOpen={setIsModalOpen} 
                onDeleteInventory={handleDeleteInventory} 
                onRestockItem={handleRestockItem} 
            />
            <AssignItem 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAssignItem={handleAssignItem} 
            />
            <RestockItem 
                isOpen={isRestockModalOpen} 
                onClose={() => setIsRestockModalOpen(false)} 
                itemToRestock={itemToRestock} 
                onRestockSuccess={(updatedInventory) => {
                    setInventoryInformation(prev => prev.map(inv =>
                        inv.Inventory_ID === updatedInventory.Inventory_ID ? updatedInventory : inv
                    ));
                    toast.success('Item restocked successfully!');
                    setIsRestockModalOpen(false);
                }} 
            />
        </>
    )
}

export default Inventory;