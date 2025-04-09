// BidFeedbackPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BidFeedbackPage.css';

const BidFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    feedback: '',
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const apiBaseUrl = 'http://localhost:5000/bid-feedback-users/';

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiBaseUrl);
      console.log('Feedback API Response:', JSON.stringify(response.data, null, 2));
      const feedbackData = response.data.bidFeedbackUsers || [];
      setFeedbackList(feedbackData);
      console.log('Feedback list set to:', JSON.stringify(feedbackData, null, 2));
    } catch (err) {
      console.error('Error fetching feedback:', err.response ? err.response.data : err.message);
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? (value === '' ? '' : parseInt(value, 10)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmSubmit = window.confirm(
      editingId ? 'Are you sure you want to update this feedback?' : 'Are you sure you want to submit this feedback?'
    );
    if (confirmSubmit) {
      try {
        if (editingId) {
          await axios.put(`${apiBaseUrl}${editingId}`, formData);
          alert('Feedback updated successfully!');
        } else {
          console.log('Submitting feedback:', formData);
          const response = await axios.post(apiBaseUrl, formData);
          console.log('Submit response:', response.data);
          alert('Feedback submitted successfully!');
        }
        setFormData({ name: '', rating: '', feedback: '' });
        setEditingId(null);
        fetchFeedback();
      } catch (err) {
        console.error('Error saving feedback:', err.response ? err.response.data : err.message);
        setError('Failed to save feedback.');
      }
    }
  };

  const handleEdit = (feedback) => {
    setFormData({
      name: feedback.name,
      rating: feedback.rating,
      feedback: feedback.feedback,
    });
    setEditingId(feedback._id);
  };

  const cancelEdit = () => {
    setFormData({ name: '', rating: '', feedback: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (confirmDelete) {
      try {
        await axios.delete(`${apiBaseUrl}${id}`);
        alert('Feedback deleted successfully!');
        fetchFeedback();
      } catch (err) {
        console.error('Error deleting feedback:', err.response ? err.response.data : err.message);
        setError('Failed to delete feedback.');
      }
    }
  };

  if (loading) {
    return <div className="bidfeedback-loading">Loading...</div>;
  }

  return (
    <div className="bidfeedback-page-wrapper">
      <div className="bidfeedback-profile-container">
        <h1>BidFeedbackPage</h1>

        {error && <div className="bidfeedback-error-message">{error}</div>}

        <div className="bidfeedback-list">
          <h2>Feedback</h2>
          {feedbackList.length === 0 ? (
            <p>No feedback yet.</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb._id} className="bidfeedback-item">
                <div className="bidfeedback-item-content">
                  <strong>{fb.name}</strong> ({fb.rating}/5)<br />
                  {fb.feedback}
                </div>
                <div className="bidfeedback-item-buttons">
                  <span
                    className="bidfeedback-btn-edit"
                    onClick={() => handleEdit(fb)}
                  >
                    Edit
                  </span>
                  <span
                    className="bidfeedback-btn-delete"
                    onClick={() => handleDelete(fb._id)}
                  >
                    Delete
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bidfeedback-form-container">
          <h2>Submit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="bidfeedback-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="bidfeedback-form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div className="bidfeedback-form-group">
              <label htmlFor="feedback">Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="bidfeedback-button-group">
              <button type="submit" className="bidfeedback-btn-save">
                {editingId ? 'Update' : 'Submit'}
              </button>
              {editingId && (
                <button type="button" className="bidfeedback-btn-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidFeedbackPage;