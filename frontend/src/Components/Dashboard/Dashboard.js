// Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import "./Dashboard.css";
import Footer from "../Footer/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }



  const role = user.username.split("_")[0]; // Extract user role

  return (
    <div>
      <Nav /> {/* Upper Navbar is always the same */}
      <div className="dashboard-container">
        <Sidebar role={role} /> {/* Sidebar changes based on user role */}
        
        <div className="dashboard-main-content">
          <h1>Welcome, {user.name}!</h1>
          {/* Display content based on user role */}
          <p>
            This is the {role === "sl" ? "Seller" : role === "bid" ? "Bidder" : role === "ship" ? "Shipping Manager" : role === "hr" ? "HR Manager" : role === "im" ? "Inspection Manager" :  "User"} Dashboard.
          </p>
          
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Dashboard;
