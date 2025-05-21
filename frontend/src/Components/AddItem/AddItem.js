import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import './AddItem.css';

function AddItem() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    startingBid: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        showPopup('Image size exceeds 10MB limit', 'error');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showPopup('Please upload an image file (JPG, PNG, GIF)', 'error');
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
      setPopupMessage('');
    }, 3000);
  };

  const resetForm = () => {
    setInputs({ title: '', description: '', startingBid: '' });
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!image) {
      showPopup('Please upload an image for the item', 'error');
      return;
    }
    if (inputs.title.trim().length < 3) {
      showPopup('Title must be at least 3 characters long', 'error');
      return;
    }
    if (inputs.description.trim().length < 10) {
      showPopup('Description must be at least 10 characters long', 'error');
      return;
    }
    if (parseFloat(inputs.startingBid) <= 0) {
      showPopup('Starting bid must be greater than 0', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', inputs.title);
      formData.append('description', inputs.description);
      formData.append('startingBid', inputs.startingBid);
      formData.append('image', image);

      const response = await axios.post('http://localhost:5000/item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showPopup('Item added successfully!', 'success');
      resetForm();
      setTimeout(() => {
        navigate('/seller-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item. Please try again.';
      showPopup(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="AddItem-page">
     
      <br/><br/><br/><br/><br/>
      <div className="AddItem-header">
        <h1>Add Item</h1>
        <div className="AddItem-back-link">
          <Link to="/seller-profile" className="back-btn">
            <i className="fas fa-arrow-left"></i> Back to Profile
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="AddItem-form-container">
        <div className="AddItem-form-content">
          <div className="AddItem-form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              value={inputs.title}
              placeholder="Enter item title"
              required
              maxLength="100"
              aria-describedby="title-error"
            />
          </div>

          <div className="AddItem-form-group">
            <label htmlFor="image">Image:</label>
            <div
              className={`image-upload-container ${isDragging ? 'active' : ''}`}
              onClick={handleImageClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleImageClick()}
              aria-describedby="image-error"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                accept="image/*"
                onChange={handleImageChange}
                id="image"
                aria-label="Upload item image"
              />
              {!imagePreview ? (
                <div>
                  <p>Click to upload or drag and drop</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    JPG, PNG or GIF (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="Item preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="AddItem-form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              value={inputs.description}
              placeholder="Enter item description"
              required
              rows="4"
              maxLength="1000"
              aria-describedby="description-error"
            />
          </div>

          <div className="AddItem-form-group">
            <label htmlFor="startingBid">Starting Bid ($):</label>
            <input
              type="number"
              id="startingBid"
              name="startingBid"
              onChange={handleChange}
              min="0.01"
              step="0.01"
              value={inputs.startingBid}
              placeholder="Enter starting bid"
              required
              aria-describedby="startingBid-error"
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Submitting item' : 'Add item'}
          >
            {isSubmitting ? 'Adding Item...' : 'Add Item'}
          </button>
        </div>
      </form>

      {popupMessage && (
        <div
          className={`popup-message ${popupType}`}
          role="alert"
          aria-live="assertive"
        >
          <p>{popupMessage}</p>
        </div>
      )}

     
    </div>
  );
}

export default AddItem;