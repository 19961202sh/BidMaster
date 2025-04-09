import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Item.css";
import axios from "axios";

function Item(props) {
  const { _id, title, description, startingBid, imageUrl, imageId } = props.item;
  const navigate = useNavigate();

  const deleteItemHandler = async () => {
    try {
      await axios
        .delete(`http://localhost:5000/items/${_id}`)
        .then((res) => res.data)
        .then(() => navigate("/"))
        .then(() => navigate("/seller-dashboard"));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteImageHandler = async () => {
    if (!imageId) return; // No image to delete
    try {
      await axios.delete(`http://localhost:5000/delete-image/${imageId}`);
      navigate("/seller-dashboard"); // Refresh the page
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="item-card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title || "Item image"}
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
      )}
      <p>ID: {_id}</p>
      <h1 className="item-title">Title: {title}</h1>
      <p className="item-description">Description: {description}</p>
      <p className="item-price">Starting Bid: ${startingBid}</p>
      <div className="item-actions">
       <button className="update-btn"><Link to={`/seller-dashboard/${_id}`}>Update</Link></button> 
        {Item &&(
        <button className="delete-btn" onClick={deleteItemHandler}>Delete Item</button>
        )}
        {imageId && (
          <button className="delete-btn" onClick={deleteImageHandler}>Delete Image</button>
        )}
      </div>
    </div>
  );
}

export default Item;