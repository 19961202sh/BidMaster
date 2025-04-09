import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import "./Nav.css"; // Import CSS file
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar

function Nav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const user = JSON.parse(localStorage.getItem("user"));

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Upper Navbar */}
      <nav className="navbar">
        {/* Logo Section */}
        <div className="logo">
          <NavLink to="/home" activeClassName="active">
            <img src="/favicon.ico" alt="AuctionApp Logo" className="logo-img" />
          </NavLink>
        </div>

        {/* Sidebar Toggle Button */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "☰" : "☰"} {/* Open/Close Sidebar */}
        </button>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search auctions..." />
          <button className="search-btn">Search</button>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <NavLink to="/home" activeClassName="active">Home</NavLink>
          <NavLink to="/aboutUs" activeClassName="active">About Us</NavLink>
          <NavLink to="/contactUs" activeClassName="active">Contact Us</NavLink>

          {/* Conditionally Render Login or Profile/Logout */}
          {!user ? (
            <NavLink to="/login" activeClassName="active" className="login-btn">Login</NavLink>
          ) : (
            <>
              <NavLink to="/profile" activeClassName="active">Profile</NavLink>
              <button
                className="logout-btn"
                onClick={() => { 
                  localStorage.removeItem("user"); 
                  window.location.href = "/login"; // Redirect to login page after logout
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Pass the state to Sidebar to control its visibility */}
      <Sidebar role={user ? user.username.split("_")[0] : "guest"} isOpen={isSidebarOpen} />
    </div>
  );
}

export default Nav;
