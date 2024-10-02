// src/pages/BookmarkPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCard from '../components/stories/StoryCard';
import { toast } from 'react-toastify';

const BookmarkPage = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const token = localStorage.getItem('token');

  const fetchBookmarkedStories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarkedStories(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookmarks');
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookmarkedStories();
    }
  }, [token]);

  if (!token) {
    return <p>Please login to view your bookmarks.</p>;
  }

  return (
    <div className="bookmark-page">
      <h2>Your Bookmarked Stories</h2>
      <div className="stories-grid">
        {bookmarkedStories.length > 0 ? (
          bookmarkedStories.map((story) => <StoryCard key={story._id} story={story} />)
        ) : (
          <p>No bookmarks found.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
