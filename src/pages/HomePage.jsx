import React, { useState } from 'react';
import StoryList from '../components/stories/StoryList';
import StoryFilter from '../components/stories/StoryFilter';

const categories = ["All", "Food","Health and Fitness", "Travel", "Movie", "Education", ];


const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="homepage">
      <StoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
      <StoryList selectedCategory={selectedCategory} categories={categories}/>

    </div>
  );
};

export default HomePage;



