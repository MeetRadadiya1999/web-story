import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './addeditstory.css'; // Make sure this path is correct
import { FaTimes } from 'react-icons/fa';

const AddEditStoryPage = ({ story, closeEditModal }) => { // Added onClose prop to handle modal close
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [slides, setSlides] = useState([
    { contentType: 'image', contentUrl: '', caption: '' },
    { contentType: 'image', contentUrl: '', caption: '' },
    { contentType: 'image', contentUrl: '', caption: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const id = story?._id;

  useEffect(() => {
    if (id) {
      const fetchStory = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/stories/${id}`);
          setTitle(res.data.title || '');
          setCategory(res.data.category || 'food');
          setSlides(res.data.slides || [
            { contentType: 'image', contentUrl: '', caption: '' },
            { contentType: 'image', contentUrl: '', caption: '' },
            { contentType: 'image', contentUrl: '', caption: '' },
          ]);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch story');
        } finally {
          setIsLoading(false);
        }
      };
      fetchStory();
    }
  }, [id]);

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = slides.map((slide, i) =>
      i === index ? { ...slide, [field]: value } : slide
    );
    setSlides(updatedSlides);
  };

  const handleAddSlide = () => {
    if (slides.length >= 6) {
      toast.error('Maximum of 6 slides allowed');
      return;
    }
    setSlides([...slides, { contentType: 'image', contentUrl: '', caption: '' }]);
  };

  const handleRemoveSlide = (index) => {
    if (slides.length <= 3) {
      toast.error('Minimum of 3 slides required');
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (slides.some(slide => !slide.contentUrl || !slide.caption)) {
      toast.error('All slide fields are required');
      return;
    }

    try {
      setIsLoading(true);
      if (story) {
        await axios.put(`${process.env.REACT_APP_API_URL}/stories/${story._id}`, { title, category, slides }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Story updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/stories`, { title, category, slides }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Story added successfully');
      }
      closeEditModal(); // Close modal on success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit story');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='add-edit-overlay'>
      <div className="add-edit-story">
        <button className='closebtn' onClick={closeEditModal}><FaTimes /></button>
        <h2>{story ? 'Edit Story' : 'Add New Story'}</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div>
              <label>Category:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="food">Food</option>
                <option value="health and fitness">Health and Fitness</option>
                <option value="travel">Travel</option>
                <option value="movie">Movie</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="slides-section">
              <h3>Slides:</h3>
              {slides.map((slide, index) => (
                <div key={index} className="slide-form">
                  <div>
                    <label>Content Type:</label>
                    <select
                      value={slide.contentType}
                      onChange={(e) => handleSlideChange(index, 'contentType', e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label>Content URL:</label>
                    <input
                      type="url"
                      required
                      value={slide.contentUrl}
                      onChange={(e) => handleSlideChange(index, 'contentUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Caption:</label>
                    <input
                      type="text"
                      required
                      value={slide.caption}
                      onChange={(e) => handleSlideChange(index, 'caption', e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveSlide(index)}
                    disabled={slides.length <= 3}
                  >
                    Remove Slide
                  </button>
                </div>
              ))}

              <button type="button" className="button" onClick={handleAddSlide} disabled={slides.length >= 6}>
                Add Slide
              </button>
            </div>

            <button type="submit" className="button">
              {story ? 'Update Story' : 'Add Story'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditStoryPage;
