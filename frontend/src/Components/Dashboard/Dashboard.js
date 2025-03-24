import React from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const role = user.username.split("_")[0];

  const renderContent = () => {
    switch (role) {
      case "sl":
        return <p>This is the Seller Dashboard. Manage your products and orders.</p>;
      case "bid":
        return <p>This is the Bidder Dashboard. View and place bids.</p>;
      case "ship":
        return <p>This is the Shipping Manager Dashboard. Manage deliveries.</p>;
      case "hr":
        return <p>This is the HR Manager Dashboard. Manage employees.</p>;
      case "im":
        return <p>This is the Inspection Manager Dashboard. Oversee product inspections.</p>;
      default:
        return <p>Welcome to the Dashboard.</p>;
    }
  };

  return (
    <div>
      <Nav role={role} />
      <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Welcome, {user.name}!</h1>
        {renderContent()}
      <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
