import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the import based on your AuthContext setup

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const userId = localStorage.getItem('userId'); // Assume the user ID is stored in localStorage

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);

        // Fetch ticket and shop purchases
        // const ticketResponse = await fetch(`/api/orders/${userId}`);
        // const ticketData = await ticketResponse.json();
        // setTickets(ticketData.tickets);

        // const shopResponse = await fetch(`/api/shop-purchases/${userId}`);
        // const shopData = await shopResponse.json();
        // setPurchases(shopData.purchases);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className='profile-header'>User Profile</h1>
      <div className="profile-info">
        <h2 className='profile-name'>{userData.firstName} {userData.lastName}</h2>
        <p>Email: {userData.email}</p>
      </div>

      <div className="tickets">
        <h3 className='title-header'>Your Tickets</h3>
        <ul className='profile-list'>
          {tickets.map((ticket, index) => (
            <li key={index}>
              Ticket Type: {ticket.type} | Date: {ticket.date}
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-purchases">
        <h3 className='title-header'>Your Shop Purchases</h3>
        <ul className='profile-list'>
          {purchases.map((purchase, index) => (
            <li key={index}>
              Item: {purchase.item} | Price: ${purchase.price} | Date: {purchase.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
