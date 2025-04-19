import AddKiosk, {UpdateKiosk} from "../modals/AddKiosk";
import './Report.css';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

function KioskTable({kioskInformation, setIsModalOpen, onEditKiosk, onDeleteKiosk, user}){
    if(!kioskInformation || !Array.isArray(kioskInformation)){
        return <div>No kiosk data is available.</div>
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const isAuthorized = user && (user.role === 'Admin' || user.role === 'Manager');
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Kiosk Name</th>
                        <th>Kiosk Type</th>
                        <th>Location</th>
                        <th>Cost</th>
                        <th>Staff Number</th>
                        <th>Status</th>
                        <th>Date Added</th>
                        {isAuthorized && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {kioskInformation.map((kiosk) => (
                        <tr key={kiosk.Kiosk_ID}>
                            <td>{kiosk.Kiosk_name}</td>
                            <td>{kiosk.Kiosk_type}</td>
                            <td>{kiosk.area_name}</td>
                            <td>${Number(kiosk.Kiosk_cost).toLocaleString()}</td>
                            <td>{kiosk.Staff_num}</td>
                            <td>{kiosk.Kiosk_operate === 1 ? 'Operational' : 'Under Maintenance'}</td>
                            <td>{formatDate(kiosk.Kiosk_created)}</td>
                            {isAuthorized && (
                                <td>
                                    <button onClick={() => onEditKiosk(kiosk)} className="action-btn edit-button">Edit</button>
                                    <button onClick={() => onDeleteKiosk(kiosk.Kiosk_ID)} className="action-btn delete-button">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Kiosk(){
    const {user} = useAuth();
    const [kioskInformation, setKioskInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredKiosks, setFilteredKiosks] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedKiosk, setSelectedKiosk] = useState(null);

    const [kioskNameFilter, setKioskNameFilter] = useState('');
    const [kioskTypeFilter, setKioskTypeFilter] = useState('');
    const [kioskLocationFilter, setKioskLocationFilter] = useState('');
    const [staffNumberFilter, setStaffNumberFilter] = useState('');
    const [costRangeFilter, setCostRangeFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const [allKiosks, setAllKiosks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kiosks] = await Promise.all([fetch('/api/kiosks/info')]);
                const kioskData = await kiosks.json();
                setAllKiosks(kioskData);
            } catch (error) {
                toast.error('Failed to load kiosk data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchKiosk = async () => {
            try {
                const response = await fetch('/api/kiosks/info');
                if(!response.ok){
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const data = await response.json();
                setKioskInformation(data);
            } catch (error) {
                setError(error.message);
                toast.error(`Failed to load kiosks: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchKiosk();
    }, []);

    useEffect(() => {
        let filtered = [...kioskInformation];
        if(kioskNameFilter){
            filtered = filtered.filter(kiosk => kiosk.Kiosk_name.toLowerCase().includes(kioskNameFilter.toLowerCase()));
        }
        if(kioskTypeFilter){
            filtered = filtered.filter(kiosk => kiosk.Kiosk_type.toLowerCase().includes(kioskTypeFilter.toLowerCase()));
        }
        if(kioskLocationFilter){
            filtered = filtered.filter(kiosk => kiosk.area_name.toLowerCase().includes(kioskLocationFilter.toLowerCase()));
        }
        if (staffNumberFilter) {
            filtered = filtered.filter(kiosk =>
                kiosk.Staff_num.toString().includes(staffNumberFilter)
            );
        }
        if(costRangeFilter){
            const [min, max] = costRangeFilter.split('-').map(Number);
            filtered = filtered.filter(kiosk => {
                const cost = Number(kiosk.Kiosk_cost);
                return cost >= min && (isNaN(max) || cost <= max);
            });
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'nameAsc':
                    return a.Kiosk_name.localeCompare(b.Kiosk_name);
                case 'nameDesc':
                    return b.Kiosk_name.localeCompare(a.Kiosk_name);
                case 'type':
                    return a.Kiosk_type.localeCompare(b.Kiosk_type);
                case 'costAsc':
                    return a.Kiosk_cost - b.Kiosk_cost;
                case 'costDesc':
                    return b.Kiosk_cost - a.Kiosk_cost;            
                default:
                    return 0;
            }
        });
        setFilteredKiosks(filtered);
    }, [kioskInformation, kioskNameFilter, kioskTypeFilter, kioskLocationFilter, staffNumberFilter, costRangeFilter, sortOption]);

    const handleAddKiosk = (newKiosk) => {
        setKioskInformation([...kioskInformation, newKiosk]);
        toast.success('Kiosk added successfully!');
    };
    
    const handleEditKiosk = (kiosk) => {
        setSelectedKiosk(kiosk);
        setIsEditOpen(true);
    };
    
    useEffect(() => {
    }, [selectedKiosk]);

    const handleUpdateKiosk = (updatedKiosk) => {
        setKioskInformation(prev => prev.map(kiosk => kiosk.Kiosk_ID === updatedKiosk.Kiosk_ID ? updatedKiosk : kiosk));
        toast.success('Kiosk updated successfully!');
    };
    
    const handleDeleteKiosk = async (kioskID) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this kiosk?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            deleteKiosk(kioskID);
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

    const deleteKiosk = async (kioskID) => {
        try {
            const toastId = toast.loading('Deleting kiosk...');
            const response = await fetch('/api/kiosks/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({Kiosk_ID: kioskID}),
            });
            const data = await response.json();
            
            if(response.ok){
                toast.success('Kiosk deleted successfully!', { id: toastId });
                setKioskInformation(prev => prev.filter(kiosk => kiosk.Kiosk_ID !== kioskID));
            } else {
                toast.error(data.message || 'Failed to delete kiosk.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const resetFilters = () => {
        setKioskNameFilter('');
        setKioskTypeFilter('');
        setKioskLocationFilter('');
        setStaffNumberFilter('');
        setCostRangeFilter('');
        setSortOption('');
        toast.success('Filters reset successfully!');
    };

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    const isAuthorized = user && (user.role === 'Admin' || user.role === 'Manager');
    return(
        <>
            <div className="filter-controls">
                <h2>Filter Kiosks</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="kioskName">Kiosk Name:</label>
                        <select type="text" id="kioskName" value={kioskNameFilter} onChange={(e) => setKioskNameFilter(e.target.value)}>
                            <option value="">-- Select a Kiosk --</option>
                            {allKiosks.map(kiosk => (
                                <option key={kiosk.Kiosk_ID} value={kiosk.Kiosk_name}>{kiosk.Kiosk_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="kioskType">Kiosk Type:</label>
                        <select 
                        id="kioskType"
                        value={kioskTypeFilter}
                        onChange={(e) => setKioskTypeFilter(e.target.value)}>
                            <option value="">-- Select a Type --</option>
                            <option value="Merch">Merch</option>
                            <option value="Food">Food</option>
                            <option value="Game">Game</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="kioskLocation">Kiosk Location:</label>
                        <select 
                        id="kioskLocation"
                        value={kioskLocationFilter}
                        onChange={(e) => setKioskLocationFilter(e.target.value)}>
                            <option value="">-- Select a Location --</option>
                            <option value="Highrise Coogs">Highrise Coogs</option>
                            <option value="Magic Coogs">Magic Coogs</option>
                            <option value="Lowball City">Lowball City</option>
                            <option value="Splash Central">Splash Central</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="staffNumber">Staff Number:</label>
                        <input
                            type="number"
                            id="staffNumber"
                            value={staffNumberFilter}
                            onChange={(e) => setStaffNumberFilter(e.target.value)}
                            placeholder="Enter staff number"
                        />
                    </div>
                    
                </div>
                <div className="filter-row">
                <div className="filter-group">
                        <label htmlFor="costRange">Cost Range:</label>
                        <select 
                        id="costRange"
                        value={costRangeFilter}
                        onChange={(e) => setCostRangeFilter(e.target.value)}>
                            <option value="">-- Select a Cost Range --</option>
                            <option value="0-100000">$0 - $100,000</option>
                            <option value="100001-500000">$100,001 - $500,000</option>
                            <option value="500001-999999">$500,001 - $999,999</option>
                            <option value="1000000-99999999999">$1,000,000+</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Select a sort method --</option>
                            <option value="nameAsc">Name (A-Z)</option>
                            <option value="nameDesc">Name (Z-A)</option>
                            <option value="type">Type</option>
                            <option value="costAsc">Cost (Low to High)</option>
                            <option value="costDesc">Cost (High to Low)</option>
                        </select>
                    </div>
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>

            <div className="db-btn">
                <h1>Coog World Kiosks</h1>
                <div>
                    {isAuthorized && (
                        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Kiosk</button>
                    )}
                </div>
            </div>
            <KioskTable kioskInformation={filteredKiosks} setIsModalOpen={setIsModalOpen} onEditKiosk={handleEditKiosk} onDeleteKiosk={handleDeleteKiosk} user={user} />
            <AddKiosk isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddKiosk={handleAddKiosk} />
            <UpdateKiosk isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedKiosk(null);}} kioskToEdit={selectedKiosk} onUpdateKiosk={handleUpdateKiosk} />
        </>
    )
}

export default Kiosk;