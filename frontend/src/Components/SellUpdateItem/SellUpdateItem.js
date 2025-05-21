import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./SellUpdateItem.css";

function SellUpdateItem() {
  const [inputs, setInputs] = useState({ id: "", title: "", description: "", startingBid: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();
  const { id } = useParams();

  // Show popup with a message and type (success/error)
  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => {
      setPopup({ message: "", type: "", visible: false });
    }, 3000);
  };

  // Fetch item details
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/item/${id}`, {
          timeout: 10000, // 10-second timeout
        });
        const itemData = res.data.items || res.data; // Handle different response formats
        if (!itemData) {
          throw new Error("Item not found in response data.");
        }
        setInputs({
          id: itemData._id || id,
          title: itemData.title || "",
          description: itemData.description || "",
          startingBid: itemData.startingBid || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching item:", {
          message: err.message,
          code: err.code,
          response: err.response?.data,
        });
        setError(
          err.response?.status === 404
            ? "Item not found."
            : "Failed to load item data. Please try again."
        );
        setLoading(false);
      }
    };
    if (id) {
      fetchHandler();
    } else {
      setError("Invalid item ID.");
      setLoading(false);
    }
  }, [id]);

  // Update item
  const sendRequest = async () => {
    try {
      // Validate inputs
      if (!inputs.title.trim() || !inputs.description.trim()) {
        throw new Error("Title and description cannot be empty.");
      }
      if (isNaN(inputs.startingBid) || Number(inputs.startingBid) < 0) {
        throw new Error("Starting bid must be a non-negative number.");
      }
      const res = await axios.put(`http://localhost:5000/item/${id}`, {
        title: String(inputs.title).trim(),
        description: String(inputs.description).trim(),
        startingBid: Number(inputs.startingBid),
      });
      showPopup("Item updated successfully!", "success");
      return res.data;
    } catch (err) {
      console.error("Error updating item:", err);
      showPopup(err.message || "Failed to update item. Please try again.", "error");
      throw err;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      setTimeout(() => navigate("/seller-dashboard"), 2000);
    } catch (err) {
      // Error is handled in sendRequest via popup
    }
  };

  if (loading) {
    return (
      <div className="AR-add-item-page">
      
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="AR-add-item-page">
       
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="AR-add-item-page">
     
      <br/><br/><br/><br/><br/>
      <div className="AR-header">
        <h1>Update Item</h1>
      </div>
      <form onSubmit={handleSubmit} className="AR-form-container AR-report-form">
        <label>Item ID:</label>
        <div className="AR-form-group">
          <input
            type="text"
            name="id"
            value={inputs.id}
            readOnly
            className="readonly-input"
          />
        </div>

        <label>Title:</label>
        <div className="AR-form-group">
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={inputs.title}
            placeholder="Enter item title"
            required
          />
        </div>

        <label>Description:</label>
        <div className="AR-form-group">
          <textarea
            name="description"
            onChange={handleChange}
            value={inputs.description}
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
            step="0.01"
            value={inputs.startingBid}
            placeholder="Enter starting bid"
            required
          />
        </div>
        <button type="submit" className="submit-button">Update Item</button>
      </form>
      {popup.visible && (
        <div className={`popup-message ${popup.type}`}>
          <span>{popup.message}</span>
        </div>
      )}
      
    </div>
  );
}

export default SellUpdateItem;