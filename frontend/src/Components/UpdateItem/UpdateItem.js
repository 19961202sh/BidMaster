import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateItem.css';

function UpdateItem() {
  const [inputs, setInputs] = useState({ id: '', title: '', description: '', startingBid: '' }); // Include id in state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  console.log('Item ID from URL:', id); // Verify ID from URL

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/items/${id}`);
        console.log('Fetched Item Data:', res.data); // Log API response
        const itemData = res.data;
        setInputs({
          id: itemData._id || id || '', // Use _id from API if available, else URL id
          title: itemData.title || '',
          description: itemData.description || '',
          startingBid: itemData.startingBid || '',
        });
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item data. Check if the item ID is valid.');
      } finally {
        setLoading(false);
      }
    };
    fetchHandler();
  }, [id]);

  useEffect(() => {
    console.log('Current Form Inputs:', inputs); // Log state changes
  }, [inputs]);

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/items/${id}`, {
        title: String(inputs.title),
        description: String(inputs.description),
        startingBid: Number(inputs.startingBid),
      });
      console.log('Update Response:', res.data); // Log update response
      return res.data;
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Form with Inputs:', inputs); // Log submission data
    await sendRequest();
    navigate('/seller-dashboard');
  };

  if (loading) return <div>Loading item details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="AR-add-item-page">
      <Nav />
      <div>
        <div className="AR-header">
          <h1>Update Item</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="AR-form-container AR-report-form">
        {/* Item ID Field (Read-Only) */}
        <label>Item ID:</label>
        <div className="AR-form-group">
          <input
            type="text"
            name="id"
            value={inputs.id || id} // Display fetched ID or URL ID
            readOnly // Make it non-editable
            className="readonly-input" // Optional: Add CSS to style it differently
          />
        </div>

        <label>Title:</label>
        <div className="AR-form-group">
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={inputs.title || ''}
            placeholder="Enter item title"
            required
          />
        </div>

        <label>Description:</label>
        <div className="AR-form-group">
          <textarea
            name="description"
            onChange={handleChange}
            value={inputs.description || ''}
            placeholder="Enter item description"
            required
            rows="5"
          />
        </div>

        <label>Starting Bid:</label>
        <div className="AR-form-group">
          <input
            type="number"
            name="startingBid"
            onChange={handleChange}
            min="0"
            value={inputs.startingBid || ''}
            placeholder="Enter starting bid"
            required
          />
        </div>
        <br />
        <button type="submit" className="submit-button">Update Item</button>
      </form>
    </div>
  );
}

export default UpdateItem;