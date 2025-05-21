import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Form state
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

  // Fetch seller profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/seller/profile');
      
      if (response.status === 200) {
        const data = response.data;
        setFormData({
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            instagram: data.socialLinks?.instagram || ''
          },
          preferences: {
            emailNotifications: data.preferences?.emailNotifications !== false,
            publicProfile: data.preferences?.publicProfile !== false
          }
        });

        // Set profile image if exists
        if (data.profilePicture) {
          const imageUrl = data.profilePicture.startsWith('/') 
            ? `http://localhost:5000${data.profilePicture}` 
            : data.profilePicture;
          setImagePreview(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showNotification('error', 'Failed to load profile data. Please try again.');
      
      // Set default data for development
      setFormData({
        username: 'Official Seller',
        email: 'seller@auction.com',
        bio: 'Passionate about antiques and collectibles.',
        phone: '555-123-4567',
        location: 'New York, NY',
        website: 'www.myauctions.com',
        socialLinks: {
          facebook: 'fb.com/myauctions',
          twitter: 'twitter.com/myauctions',
          instagram: 'instagram.com/myauctions'
        },
        preferences: {
          emailNotifications: true,
          publicProfile: true
        }
      });
      setImagePreview('https://via.placeholder.com/150?text=Profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle social links changes
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value
      }
    });
  };

  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: checked
      }
    });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      // Create form data for multipart/form-data submission (for image upload)
      const profileFormData = new FormData();
      
      // Append profile image if changed
      if (profileImage) {
        profileFormData.append('profilePicture', profileImage);
      }
      
      // Append form data as JSON string
      profileFormData.append('userData', JSON.stringify(formData));

      const response = await axios.put(
        'http://localhost:5000/seller/profile/update',
        profileFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        showNotification('success', 'Profile updated successfully!');
        // Navigate back to profile after a delay
        setTimeout(() => {
          navigate('/seller-profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile. Please try again.');
      
      // For development, simulate success
      showNotification('success', 'Profile updated successfully! (Development mode)');
      setTimeout(() => {
        navigate('/seller-profile');
      }, 2000);
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/seller-profile');
  };

  // Helper function to show notifications
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  return (
    <div className="edit-profile-page">
      <Nav />

      {/* Hero Section */}
      <section className="edit-profile-hero">
        <h1>Edit Profile</h1>
        <p>Update your profile information and preferences</p>
      </section>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? (
            <i className="fas fa-check-circle"></i>
          ) : (
            <i className="fas fa-exclamation-circle"></i>
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Main Form Section */}
      <div className="edit-profile-container">
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading profile data...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="edit-profile-form">
            <div className="form-grid">
              {/* Profile Image Section */}
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
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <p className="image-upload-hint">Click to upload a new profile picture</p>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <h2 className="section-title">Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell buyers about yourself..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(Optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="form-section">
                <h2 className="section-title">Social Media Links</h2>
                
                <div className="form-group">
                  <label htmlFor="facebook">
                    <i className="fab fa-facebook"></i> Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleSocialLinkChange}
                    placeholder="Facebook profile URL"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="twitter">
                    <i className="fab fa-twitter"></i> Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialLinkChange}
                    placeholder="Twitter profile URL"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="instagram">
                    <i className="fab fa-instagram"></i> Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialLinkChange}
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="form-section">
                <h2 className="section-title">Preferences</h2>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.preferences.emailNotifications}
                    onChange={handlePreferenceChange}
                  />
                  <label htmlFor="emailNotifications">
                    Email Notifications
                    <span className="checkbox-description">
                      Receive emails about bids, sales, and site updates
                    </span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="publicProfile"
                    name="publicProfile"
                    checked={formData.preferences.publicProfile}
                    onChange={handlePreferenceChange}
                  />
                  <label htmlFor="publicProfile">
                    Public Profile
                    <span className="checkbox-description">
                      Allow other users to view your profile information
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancel}
                disabled={saveLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;