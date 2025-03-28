import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the import based on your AuthContext setup

const Profile = () => {
    const { token } = useAuth(); // Get the JWT token from context
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {  // ✅ Fixed function name
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data); // ✅ Removed extra space
            } catch (err) {
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile(); // ✅ Fixed function call
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>User Profile</h1>
            <p>First Name: {user?.first_name}</p>
            <p>Last Name: {user?.last_name}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
            <p>Address: {user?.address}</p>
            {/* Add more fields as necessary */}
        </div>
    );
};

export default Profile;
