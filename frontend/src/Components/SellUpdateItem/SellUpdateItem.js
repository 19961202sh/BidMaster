import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SellUpdateItem.css";

function SellUpdateItem() {
  const [inputs, setInputs] = useState({
    id: "",
    title: "",
    description: "",
    startingPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const [isApproved, setIsApproved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Show popup
  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => {
      setPopup({ message: "", type: "", visible: false });
    }, 2500);
  };

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/items/${id}`);
        const item = res.data;

        if (!item) {
          throw new Error("Item not found.");
        }

        setInputs({
          id: item._id || id,
          title: item.name || "",
          description: item.description || "",
          startingPrice: item.startingPrice || item.price || "",
        });

        // Check if item is approved to disable editing
        setIsApproved(item.inspectionStatus === "Approved");

        setLoading(false);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(
          err.response?.status === 404
            ? "Item not found."
            : "Failed to load item. Please try again."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    } else {
      setError("Invalid item ID.");
      setLoading(false);
    }
  }, [id]);

  // Update item
  const sendRequest = async () => {
    try {
      if (!inputs.title.trim() || !inputs.description.trim()) {
        throw new Error("Title and description cannot be empty.");
      }
      if (isNaN(inputs.startingPrice) || Number(inputs.startingPrice) < 0) {
        throw new Error("Starting price must be a non-negative number.");
      }

      const res = await axios.put(`http://localhost:5000/items/${id}`, {
        name: String(inputs.title).trim(),
        description: String(inputs.description).trim(),
        startingPrice: Number(inputs.startingPrice),
      });

      showPopup("Item updated successfully!", "success");
      return res.data;
    } catch (err) {
      console.error("Error updating item:", err);

      if (err.response?.status === 403) {
        showPopup("This item has been approved and cannot be edited.", "error");
        setIsApproved(true); // Disable form if backend says no
      } else {
        showPopup(err.message || "Failed to update item. Please try again.", "error");
      }
      throw err;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      setTimeout(() => navigate("/seller-dashboard"), 2000);
    } catch (err) {
      // Error shown in popup
    }
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="AR-add-item-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Render form with disabled inputs if approved
  return (
    <div className="AR-add-item-page">
      <br /><br /><br /><br /><br />
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
            disabled={isApproved}
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
            disabled={isApproved}
          />
        </div>

        <label>Starting Price:</label>
        <div className="AR-form-group">
          <input
            type="number"
            name="startingPrice"
            onChange={handleChange}
            min="0"
            step="0.01"
            value={inputs.startingPrice}
            placeholder="Enter starting price"
            required
            disabled={isApproved}
          />
        </div>

        <button type="submit" className="submit-button" disabled={isApproved}>
          Update Item
        </button>
        {isApproved && (
          <p style={{ color: "red", marginTop: "10px" }}>
            This item has been approved and cannot be edited.
          </p>
        )}
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
