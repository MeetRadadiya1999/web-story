import React, { useEffect, useState } from "react";
import axios from "axios";
import StoryCard from "./StoryCard";
import { toast } from "react-toastify";
import "./storylist.css"; 

const StoryList = ({ selectedCategory }) => {
  const [storiesByCategory, setStoriesByCategory] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/stories`, {
        params:
          selectedCategory !== "All"
            ? { category: selectedCategory.toLowerCase() }
            : {},
      });

      const stories = res.data;

      // Group stories by category
      const groupedStories = stories.reduce((acc, story) => {
        const { category } = story;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(story);
        return acc;
      }, {});
      setStoriesByCategory(groupedStories);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch stories");
      toast.error(error.response?.data?.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const toggleExpandCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="story-list">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : Object.keys(storiesByCategory).length === 0 ? (
        <p>No stories available at the moment</p>
      ) : (
        Object.keys(storiesByCategory).map((category) => {
          const stories = storiesByCategory[category];
          const isExpanded = expandedCategories[category];
          const visibleStories = isExpanded ? stories : stories.slice(0, 4);

          return (
            <div key={category} className="story-category">
              <h3>Top Stories About {category}</h3>
              {stories.length === 0 ? (
                <p>No stories found in this category</p>
              ) : (
                <div className="stories-grid">
                  {visibleStories.map((story) => (
                    <StoryCard key={story._id} story={story} />
                  ))}
                </div>
              )}
              {stories.length > 4 && (
                <button
                  className="see-more-btn"
                  onClick={() => toggleExpandCategory(category)}
                >
                  {isExpanded ? "Show Less" : "See More"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StoryList;
