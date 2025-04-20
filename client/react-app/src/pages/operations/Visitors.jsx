import React, {useState, useEffect} from "react";
import { UpdateVisitor } from "../modals/UpdateVisitors";
import toast from "react-hot-toast";
import './Report.css';

function VisitorTable({visitorInformation, setIsModalOpen, onEditVisitor, onDeleteVisitor}){
    if (!visitorInformation || !Array.isArray(visitorInformation)) {
        return <div>No visitor data is available.</div>
    }
    return(
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visitorInformation.map((visitor) => (
                        <tr key={visitor.Visitor_ID}>
                            <td>{visitor.Last_name}</td>
                            <td>{visitor.First_name}</td>
                            <td>{visitor.Email}</td>
                            <td>{visitor.Phone}</td>
                            <td>{visitor.Address}</td>
                            <td>
                                <button onClick={() => onEditVisitor(visitor)} className="action-btn edit-button">Edit</button>
                                <button onClick={() => onDeleteVisitor(visitor.Visitor_ID)} className="action-btn delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Visitor(){
    const [visitorInformation, setVisitorInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [selectedVisitor, setSelectedVisitor] = useState(null);

    const [filteredUsers, setFilteredUsers] = useState('');
    const [firstNameFilter, setFirstNameFilter] = useState('');
    const [lastNameFilter, setLastNameFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    const fetchVisitors = async () => {
        try {
            const response = await fetch('/api/users/info');
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            setVisitorInformation(data);
        } catch (error) {
            setError(error.message);
            toast.error(`Failed to load visitors: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    useEffect(() => {
        let filtered = [...visitorInformation];
        if(firstNameFilter){
            filtered = filtered.filter(user => user.First_name.toLowerCase().includes(firstNameFilter.toLowerCase()))
        }
        if(lastNameFilter){
            filtered = filtered.filter(user => user.Last_name.toLowerCase().includes(lastNameFilter.toLowerCase()));
        }
        filtered.sort((a,b) => {
            switch (sortOption) {
                case 'nameAsc':
                    return a.Last_name.localeCompare(b.Last_name);
                case 'nameDesc':
                    return b.Last_name.localeCompare(a.Last_name);          
                default:
                    return 0;
            }
        });
        setFilteredUsers(filtered);
    }, [visitorInformation, firstNameFilter, lastNameFilter, sortOption]);

    const handleEditVisitor = (visitor) => {
        setSelectedVisitor(visitor);
        setIsEditOpen(true);
    };
    
    const handleUpdateVisitor = (updatedVisitor) => {
        setVisitorInformation(prev => prev.map(user => user.Visitor_ID === updatedVisitor.Visitor_ID ? updatedVisitor : user));
        toast.success('Visitor updated successfully!');
    };

    const handleDeleteVisitor = async (userID) => {
        toast.custom((t) => (
            <div className="custom-toast">
                <p>Are you sure you want to delete this user?</p>
                <p>This action cannot be undone.</p>
                <div className="toast-buttons">
                    <button onClick={() => {deleteVisitor(userID); toast.dismiss(t.id);}} className="toast-confirm">Confirm</button>
                    <button onClick={() => toast.dismiss(t.id)} className="toast-cancel">Cancel</button>
                </div>
            </div>
        ), {duration: Infinity, position: 'top-center'});
    };

    const deleteVisitor = async (userID) => {
        try {
            const toastId = toast.loading('Deleting user...');
            const response = await fetch('/api/users/delete-selected', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({Visitor_ID: userID}),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('User deleted successfully!', { id: toastId });
                setVisitorInformation(prev => prev.filter(user => user.Visitor_ID !== userID));
                fetchVisitors();
            } else {
                toast.error(data.message || 'Failed to delete user.', { id: toastId });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };
    const resetFilters = () => {
        setFirstNameFilter('');
        setLastNameFilter('');
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
                <h2>Filter Visitors</h2>
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="userfname">First Name:</label>
                        <input type="text" id="userfname" value={firstNameFilter} onChange={(e) => setFirstNameFilter(e.target.value)} placeholder="Filter by First Name" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="userlname">Last Name:</label>
                        <input type="text" id="userlname" value={lastNameFilter} onChange={(e) => setLastNameFilter(e.target.value)} placeholder="Filter by Last Name" />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By:</label>
                        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">-- Sort Method --</option>
                            <option value="nameAsc">Last Name (A-Z)</option>
                            <option value="nameDesc">Last Name (Z-A)</option>
                        </select>
                    </div>
                </div>
                <div className="filter-row">
                    <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>
            <div className="db-btn">
                <h1>Coog World Visitors</h1>
            </div>
            <VisitorTable visitorInformation={filteredUsers} setIsModalOpen={setIsModalOpen} onEditVisitor={handleEditVisitor} onDeleteVisitor={handleDeleteVisitor} />
            <UpdateVisitor isOpen={isEditOpen} onClose={() => {setIsEditOpen(false); setSelectedVisitor(null);}} userToEdit={selectedVisitor} onUpdateUser={handleUpdateVisitor} />
        </>
    );
}

export default Visitor;