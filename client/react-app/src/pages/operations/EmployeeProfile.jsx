import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal.jsx'; 

function formatUTCToCentralTime(mysqlDatetime) {
  if (!mysqlDatetime) return 'N/A';
  const date = new Date(mysqlDatetime);
  if (isNaN(date)) return 'Invalid Date';
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
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

        <div className="password-section">
          <button button className="add-button" onClick={() => setShowPasswordForm(prev => !prev)}>
            {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
          </button>

          {showPasswordForm && (
            <div className="password-change-section">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button button className="add-button"
                onClick={() => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    setPasswordMessage('Please fill out all fields.');
                  } else if (newPassword !== confirmPassword) {
                    setPasswordMessage('New passwords do not match.');
                  } else {
                    setPasswordMessage('');
                    setShowConfirmationModal(true);
                  }
                }}
                disabled={changingPassword}
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
              {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </div>
          )}
        </div>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to update your password?"
          onConfirm={async () => {
            setShowConfirmationModal(false);
            setChangingPassword(true);

            try {
              const res = await fetch('/api/employees/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  empId: profile.Emp_ID,
                  currentPassword,
                  newPassword,
                }),
              });

              const data = await res.json();

              if (res.ok) {
                setPasswordMessage('Password updated successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              } else {
                setPasswordMessage(data.message || 'Failed to update password.');
              }
            } catch (err) {
              console.error(err);
              setPasswordMessage('An error occurred while updating the password.');
            } finally {
              setChangingPassword(false);
            }
          }}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
