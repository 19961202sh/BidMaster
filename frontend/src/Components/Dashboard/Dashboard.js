import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const role = user.username.split("_")[0]; // Extract user role

  return (
    <div className="dashboard-container">
      <Sidebar role={role} /> {/* Sidebar changes based on user role */}
      <div className="dashboard-main-content">
        <div className="dashboard-box">
        <h1>Hi {user.name} !</h1>
        <p> Welcome to the {role === "sl" ? "Seller " : role === "bid" ? "Bidder" : role === "ship" ? "Shipping Manager " : role === "hr" ? "HR Manager " : role === "im" ? "Inspection Manager " : "User "} 
           Dashboard  Manage your tasks and explore the features.</p>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
