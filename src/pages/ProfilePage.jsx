import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  if (!token) {
    return <p>Please login to view your profile.</p>;
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default ProfilePage;
