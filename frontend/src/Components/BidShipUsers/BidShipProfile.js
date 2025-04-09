import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './BidShipProfile.css';

const BidShipProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    age: '',
    mobileNo: '',
    shippingAddress: '',
    postalCode: '',
    country: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.editDetail) {
      const { _id, fullname, email, age, mobileNo, shippingAddress, postalCode, country } = location.state.editDetail;
      setFormData({ fullname, email, age, mobileNo, shippingAddress, postalCode, country });
      setEditingId(_id);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' || name === 'mobileNo' ? (value === '' ? '' : parseInt(value, 10)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmSubmit = window.confirm('Are You Sure You Want To Submit Your Shipping Details?');
    if (confirmSubmit) {
      try {
        if (editingId) {
          await axios.put(`http://localhost:5000/bid-ship-users/${editingId}`, formData);
        } else {
          await axios.post(`http://localhost:5000/bid-ship-users`, formData);
        }
        setFormData({ fullname: '', email: '', age: '', mobileNo: '', shippingAddress: '', postalCode: '', country: '' });
        setEditingId(null);
        navigate('/submission-success');
      } catch (err) {
        setError('Failed to save shipping details.');
        console.error('Error saving details:', err);
      }
    }
  };

  const cancelEdit = () => {
    setFormData({ fullname: '', email: '', age: '', mobileNo: '', shippingAddress: '', postalCode: '', country: '' });
    setEditingId(null);
  };

  const handlePreviousDetails = () => {
    navigate('/bid-ship-users-details');
  };

  if (loading) {
    return <div className="bidshipprofile-loading">Loading...</div>;
  }

  return (
    <div className="bidshipprofile-container">
      <div className="bidshipprofile-background-wrapper"></div> {/* Full-screen background wrapper */}
      <h1 className="bidshipprofile-h1">Bidder Shipping Profile</h1>
      
      {error && <div className="bidshipprofile-error-message">{error}</div>}
      
      <div className="bidshipprofile-form-container">
        <h2 className="bidshipprofile-h2">{editingId ? 'Update Shipping Details' : 'Submit Shipping Details'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="bidshipprofile-form-group">
            <label htmlFor="fullname" className="bidshipprofile-label">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="email" className="bidshipprofile-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="age" className="bidshipprofile-label">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="mobileNo" className="bidshipprofile-label">Mobile Number</label>
            <input
              type="number"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="shippingAddress" className="bidshipprofile-label">Shipping Address</label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              required
              className="bidshipprofile-textarea"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="postalCode" className="bidshipprofile-label">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-form-group">
            <label htmlFor="country" className="bidshipprofile-label">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="bidshipprofile-input"
            />
          </div>
          <div className="bidshipprofile-button-group">
            <button type="submit" className="bidshipprofile-btn-save">
              {editingId ? 'Update' : 'Submit'}
            </button>
            {editingId && (
              <button type="button" className="bidshipprofile-btn-cancel" onClick={cancelEdit}>
                Cancel
              </button>
            )}
            <button type="button" className="bidshipprofile-btn-previous" onClick={handlePreviousDetails}>
              Previous Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidShipProfile;