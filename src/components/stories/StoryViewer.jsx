import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaBookmark,
  FaShareAlt,
  FaDownload,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "./storyviewer.css";

const StoryViewer = ({ onClose, storyId }) => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [slides, setSlides] = useState([]); // Separate state for slides
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = localStorage.getItem("token");

  // Timer reference
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchStory = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/stories/${storyId}`
      );
      setStory(res.data);

      // Fetch slide details using the slide IDs
      const slideRequests = res.data.slides.map((slide) => {
        const slideId = typeof slide === "object" ? slide._id : slide;
        return axios.get(`${process.env.REACT_APP_API_URL}/slides/${slideId}`);
      });

      const slideResponses = await Promise.all(slideRequests);
      const slideDetails = slideResponses.map((response) => response.data);
      setSlides(slideDetails); // Set the detailed slides data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch story");
    }
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const handleLike = async (slideId) => {
    if (!token) {
      toast.error("You need to login to like slides");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/slides/${slideId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStory(); // Refresh story after liking
      toast.success("Slide liked");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to like slide");
      }
    }
  };

  const handleBookmark = async () => {
    if (!token) {
      toast.error("You need to login to bookmark stories");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/stories/${storyId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Story bookmarked");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to bookmark story"
        );
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Story link copied to clipboard");
  };

  const handleDownload = (slide) => {
    const link = document.createElement("a");
    link.href = slide.contentUrl;
    link.download = `${story.title}-slide-${slide._id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "closeClick") {
      onClose(); // Close modal if overlay is clicked
    }
  };

  if (!story) return <p>Loading...</p>;

  return (
    <div
      className="story-viewer-modal"
      id="closeClick"
      onClick={handleOverlayClick}
    >
      {/* Story Viewer Content */}
      <div
        className="story-viewer-content"
        id="closeClick"
        onClick={handleOverlayClick}
      >
        {/* Previous Button: Positioned before the slide */}
        <button
          className="prev-button"
          onClick={handlePrevSlide}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft />
        </button>

        {/* Slide Content */}
        <div className="slide-container">
          <div
            className="timer-bar"
            style={{ width: `${(currentIndex + 1) * (100 / slides.length)}%` }}
          />
          <div className="slide">
            {slides.length > 0 && (
              <div className="slide-content">
                {slides[currentIndex].contentType === "image" ? (
                  <img
                    className="slide-media" // Add this class for styling
                    src={slides[currentIndex].contentUrl}
                    alt={`Slide ${currentIndex + 1}`}
                  />
                ) : (
                  <video className="slide-media" controls>
                    <source
                      src={slides[currentIndex].contentUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
                               
                <div className="overlay-content">
                  {/* Close Button: Now in the top-left */}
                  <button className="close-button" onClick={onClose}>
                    <FaTimes />
                  </button>

                  {/* Share Button: Now in the top-right */}
                  <button className="share-button" onClick={handleShare}>
                    <FaShareAlt /> Share
                  </button>
                  <p className="caption">{slides[currentIndex].caption}</p>
                  <div className="story-actions">
                    <button
                      onClick={() => handleLike(slides[currentIndex]._id)}
                    >
                      <FaHeart /> Like (
                      {slides[currentIndex].likes
                        ? slides[currentIndex].likes.length
                        : 0}
                      )
                    </button>
                    <button onClick={handleBookmark}>
                      <FaBookmark /> Bookmark
                    </button>
                    <button
                      onClick={() => handleDownload(slides[currentIndex])}
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Button: Positioned after the slide */}
        <button
          className="next-button"
          onClick={handleNextSlide}
          disabled={currentIndex === slides.length - 1}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
