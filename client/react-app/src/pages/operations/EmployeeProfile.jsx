import React, { useEffect, useState } from 'react';

function formatUTCToCentralTime(mysqlDatetime) {
    if (!mysqlDatetime) return 'N/A';

    const date = new Date(mysqlDatetime);

    if (isNaN(date)) {
        return 'Invalid Date';
    }

    const januaryFirst = new Date(date.getFullYear(), 0, 1);
    const isDST = date.getTimezoneOffset() < januaryFirst.getTimezoneOffset();
    const offset = isDST ? 5 : 6;

    date.setHours(date.getHours() - offset);

    return date.toLocaleString('en-US', { timeZone: 'America/Chicago' });
}
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState('Loading...');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const empId = parsedUser?.Emp_ID || parsedUser?.id;

        if (!empId) {
            setStatus('User not found. Please log in.');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/employees/profile/${empId}`);
                const data = await res.json();

                if (res.ok) {
                    setProfile(data);
                    setStatus('');
                } else {
                    setStatus(data.message || 'Failed to load profile.');
                }
            } catch (err) {
                console.error(err);
                setStatus('Error fetching profile data.');
            }
        };

        fetchProfile();
    }, []);

    if (status) {
        return <div className="profile-container"><p>{status}</p></div>;
    }

    if (!profile) return null;

    const initials = `${profile.First_name?.[0] || ''}${profile.Last_name?.[0] || ''}`.toUpperCase();

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="avatar">{initials}</div>
                <h2>{profile.First_name} {profile.Last_name}</h2>
                <p>{profile.Emp_email}</p>

                <div className="role-container">
                    <h4>Position - Sector</h4>
                    <p className="role-sector">{profile.position} - {profile.sector}</p>
                </div>

                <div className="meta">
                    <span>Start Date: {formatDate(profile.Start_date)}</span>
                    <span>Salary: ${parseFloat(profile.Emp_salary).toFixed(2)}</span>
                </div>

                <div className="attendance-info">
                    <div className="attendance-block">
                        <h4>Recent Clock-In</h4>
                        <p>{formatUTCToCentralTime(profile.clock_in)}</p>
                    </div>
                    <div className="attendance-block">
                        <h4>Recent Clock-Out</h4>
                        <p>{formatUTCToCentralTime(profile.clock_out)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;