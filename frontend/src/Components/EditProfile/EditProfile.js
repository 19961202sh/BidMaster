import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    preferences: {
      emailNotifications: true,
      publicProfile: true
    }
  });

  // ✅ Input Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [name]: checked }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const form = new FormData();

      if (profileImage) {
        form.append('profilePicture', profileImage);
      }

      form.append('userData', JSON.stringify(formData));

      const res = await axios.put(
        'http://localhost:5000/seller/profile/update',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.status === 200) {
        showNotification('success', 'Profile updated successfully!');
        setTimeout(() => navigate('/seller-profile'), 2000);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/seller-profile');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };

  return (
    <div className="edit-profile-page">
      <Nav />

      <section className="edit-profile-hero">
        <h1>Edit Profile</h1>
        <p>Update your profile details and preferences</p>
      </section>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      <div className="edit-profile-container">
        <form onSubmit={handleSaveProfile} className="edit-profile-form">
          <div className="form-grid">
            {/* Profile Image */}
            <div className="profile-image-section">
              <div className="profile-image-container">
                <img
                  src={imagePreview || 'https://via.placeholder.com/150?text=Profile'}
                  alt="Profile"
                  className="profile-image-preview"
                />
                <div className="image-upload-overlay">
                  <label htmlFor="profile-image-upload">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              </div>
              <p className="image-upload-hint">Click to upload a new profile picture</p>
            </div>

            {/* Basic Info */}
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="form-section">
              <h2>Social Links</h2>
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleSocialLinkChange}
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleSocialLinkChange}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="form-section">
              <h2>Preferences</h2>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.preferences.emailNotifications}
                  onChange={handlePreferenceChange}
                />
                <label>Email Notifications</label>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="publicProfile"
                  checked={formData.preferences.publicProfile}
                  onChange={handlePreferenceChange}
                />
                <label>Public Profile</label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} disabled={saveLoading}>
              Cancel
            </button>
            <button type="submit" disabled={saveLoading}>
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
