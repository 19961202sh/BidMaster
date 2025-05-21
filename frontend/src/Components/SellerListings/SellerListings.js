import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerListings.css";

import axios from "axios";

import { jsPDF } from "jspdf";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function SellerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/item`);
      setListings(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/add-item");
  };

  const handleDownload = async (listing) => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Add title
    doc.setFontSize(18);
    doc.text("Item Details", 20, yOffset);
    yOffset += 10;

    // Add item details
    doc.setFontSize(12);
    doc.text(`Title: ${listing.title || "Untitled"}`, 20, yOffset);
    yOffset += 10;
    doc.text(
      `Description: ${
        listing.description || "No description"
      }`,
      20,
      yOffset,
      { maxWidth: 170 } // Wrap text if too long
    );
    yOffset += Math.ceil((listing.description || "").length / 85) * 10 + 10;
    doc.text(
      `Price: $${parseFloat(listing.startingBid).toFixed(2)}`,
      20,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Status: ${
        listing.status
          ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1)
          : "Pending"
      }`,
      20,
      yOffset
    );
    yOffset += 10;

    // Add image if available
    if (listing.image && !listing.image.includes("via.placeholder.com")) {
      try {
        const imgUrl = `${API_BASE_URL}/${listing.image}`;
        // Create an image element to load the image
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = imgUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Failed to load image"));
        });

        // Create a canvas to convert the image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/jpeg");

        // Add image to PDF (scale to fit)
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 40; // Margin
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, "JPEG", 20, yOffset, pdfWidth, imgHeight);
      } catch (err) {
        console.error("Error embedding image:", err);
        doc.text("Image: Not available", 20, yOffset);
      }
    } else {
      doc.text("Image: Not available", 20, yOffset);
    }

    // Save the PDF
    doc.save(`${listing.title || "item"}-details.pdf`);
  };

  if (loading) {
    return (
      <div className="SellerListing-page">
        
        <div className="SellerListing-loading" aria-live="polite">
          Loading listings...
        </div>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="SellerListing-page">
        
        <div className="SellerListing-error" aria-live="assertive">
          Error: {error}
        </div>
        
      </div>
    );
  }

  return (
    <div className="SellerListing-page">
      
      <br/><br/><br/><br/>
      <div className="SellerListing-header">
        <h1>My Listings</h1>
        <button
          className="SellerListing-add-listing-btn"
          onClick={handleAddNew}
          aria-label="Add new listing"
        >
          Add New Listing
        </button>
      </div>

      <div className="SellerListing-table-container">
        <table className="SellerListing-table" aria-label="Seller listings table">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Item Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan="6" className="SellerListing-no-listings">
                  No listings available.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    <img
                      src={
                        listing.image
                          ? `${API_BASE_URL}/${listing.image}`
                          : "https://via.placeholder.com/50?text=No+Image"
                      }
                      alt={listing.title}
                      className="SellerListing-listing-thumbnail"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                  </td>
                  <td>{listing.title}</td>
                  <td className="SellerListing-description-cell">
                    {listing.description?.length > 50
                      ? `${listing.description.substring(0, 50)}...`
                      : listing.description || "No description"}
                  </td>
                  <td>${parseFloat(listing.startingBid).toFixed(2)}</td>
                  <td>
                    {listing.status
                      ? listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1)
                      : "Pending"}
                  </td>
                  <td className="SellerListing-actions-cell">
                    <button
                      className="SellerListing-download-btn"
                      onClick={() => handleDownload(listing)}
                      aria-label={`Download PDF for ${listing.title}`}
                    >

                      Download PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <br/><br/><br/><br/>
     
    </div>
  );
}

export default SellerListings;