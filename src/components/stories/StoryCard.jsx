import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./storycard.css"; // Keep your existing styles here
import StoryViewer from "./StoryViewer";
import AddEditStoryPage from "../../pages/AddEditStoryPage";

const StoryCard = ({ story }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("user_id");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchStory = async () => {
    try {
      // Fetch the first slide of the story (if any)
      if (story.slides?.length > 0) {
        const firstSlideId =
          typeof story.slides[0] === "object"
            ? story.slides[0]._id
            : story.slides[0];
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/slides/${firstSlideId}`
        );
        const firstSlide = response.data;

        // If the first slide has a contentUrl, set it as the image URL
        if (firstSlide.contentUrl) {
          setImgUrl(firstSlide.contentUrl);
        } else {
          setImgUrl("/path-to-fallback-image.jpg");
        }
      }
    } catch (error) {
      console.error(
        "Failed to fetch slide:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchStory(); // Fetch story image
  }, [story]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="story-card-container">
      <div className="story-page">
        {isModalOpen && (
          <StoryViewer onClose={closeModal} storyId={story._id} />
        )}
      </div>
      <div onClick={openModal} className="story-card">
        <img
          src={imgUrl}
          alt={`${story.title} slide`}
          className="story-image"
        />
        <div className="story-content-overlay">
          <h3 className="story-title">{story.title} title</h3>
          <p className="story-category">Category: {story.category}</p>
        </div>
      </div>

      {loggedInUserId &&
        story.createdBy &&
        story.createdBy._id === loggedInUserId && (
          <button className="edit-button" onClick={openEditModal}>
            edit
            {/* <AddEditStoryPage story={story}/> */}
          </button>
        )}

      <div className="story-page">
        {isEditModalOpen && (
          <AddEditStoryPage story={story} closeEditModal={closeEditModal}/>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
