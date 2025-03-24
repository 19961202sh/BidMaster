import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css"; // Import CSS file

function Nav() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user ? user.username.split("_")[0] : null; // Extract role only if user exists

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/">
          <img src="/favicon.ico" alt="AuctionApp Logo" className="logo-img" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search auctions..." />
        <button className="search-btn">Search</button>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about-us">About Us</Link>

        {/* Role-Based Navigation */}
        {role === "sl" && <Link to="/manage-products">Manage Products</Link>}
        {role === "bid" && <Link to="/bids">Your Bids</Link>}
        {role === "ship" && <Link to="/shipping-tasks">Shipping Tasks</Link>}
        {role === "hr" && <Link to="/employees">HR Management</Link>}
        {role === "im" && <Link to="/inspections">Inspection Reports</Link>}

        <Link to="/contact-us">Contact Us</Link>
        <Link to="/profile">Profile</Link>

        {/* Logout Button */}
        {user && (
          <button 
            className="logout-btn"
            onClick={() => { 
              localStorage.removeItem("user"); 
              window.location.href = "/login"; 
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
