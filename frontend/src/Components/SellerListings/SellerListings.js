import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from '../Nav/Nav';
import "./SellerListings.css";
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const SellerListings = () => {
  const [listings, setListings] = useState([
    { id: 1, title: "Vintage Watch", description: "A classic timepiece", startingBid: 100, status: "Draft", startDate: "2025-04-01" },
    { id: 2, title: "Antique Vase", description: "Porcelain vase", startingBid: 150, status: "Live", startDate: "2025-03-25" },
    { id: 3, title: "Old Book", description: "Rare first edition", startingBid: 200, status: "Ended", startDate: "2025-03-20" },
  ]);

  const [filter, setFilter] = useState("All");

  const handleDelete = (id) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

  const filteredListings = filter === "All" 
    ? listings 
    : listings.filter(listing => listing.status === filter);

  const sortedListings = [...filteredListings].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  // Sample chart data
  const statusDistributionData = {
    labels: ["Draft", "Live", "Ended"],
    datasets: [
      {
        data: [
          listings.filter(l => l.status === "Draft").length,
          listings.filter(l => l.status === "Live").length,
          listings.filter(l => l.status === "Ended").length,
        ],
        backgroundColor: ['#ff8a65', '#4682b4', '#483d8b'],
        hoverOffset: 4,
      },
    ],
  };

  const bidTrendsData = {
    labels: listings.map(l => l.title),
    datasets: [
      {
        label: 'Starting Bid ($)',
        data: listings.map(l => l.startingBid),
        fill: false,
        borderColor: '#ff8a65',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="seller-listings-page">
      <Nav /><br/><br/>
      <h1>Seller Listings</h1>
      <p>Manage your auction listings below.</p>

      {/* Navigation Links */}
      <div className="navigation-links">
        <Link to="/create-listing">Create Listing</Link>
        <Link to="/live-bids">Live Bids</Link>
        <Link to="/seller-dashboard">Dashboard</Link>
      </div>

      {/* 2x2 Grid Container */}
      <div className="grid-container">
        {/* Listings Card */}
        <div className="card listings-container">
          <h2>Your Listings</h2>
          <div className="filter-section">
            <label>Filter by Status: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Draft">Draft</option>
              <option value="Live">Live</option>
              <option value="Ended">Ended</option>
            </select>
          </div>
          {sortedListings.length === 0 ? (
            <p>No listings available.</p>
          ) : (
            <table className="listings-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Starting Bid</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.title}</td>
                    <td>{listing.description}</td>
                    <td>${listing.startingBid}</td>
                    <td>{listing.status}</td>
                    <td>{listing.startDate}</td>
                    <td>
                      <button className="view-btn">View</button>
                      {listing.status !== "Live" && listing.status !== "Ended" && (
                        <>
                          <button className="edit-btn" onClick={() => alert(`Edit listing ${listing.id}`)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(listing.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Status Distribution Card */}
        <div className="card chart-container">
          <h2>Status Distribution</h2>
          <div className="chart">
            <Pie data={statusDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Bid Trends Card */}
        <div className="card chart-container">
          <h2>Bid Trends</h2>
          <div className="chart">
            <Line data={bidTrendsData} options={chartOptions} />
          </div>
        </div>

        {/* Navigation Card (for balance) */}
        <div className="card navigation-card">
          <h2>Quick Links</h2>
          <div className="nav-links">
            <Link to="/create-listing">Create New Listing</Link>
            <Link to="/live-bids">View Live Bids</Link>
            <Link to="/seller-dashboard">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerListings;