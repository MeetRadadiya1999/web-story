import React from "react";
import "./filter.css"; 

const StoryFilter = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <div
          key={category}
          className={`category-card ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default StoryFilter;
