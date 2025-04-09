import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role, isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
   
      {/* Role-Based Sidebar Navigation */}
      {role === "sl" && (
        <>
          <Link to="/seller-dashboard">Seller Dashboard</Link>
          <Link to="/seller-listing">Item Listing</Link>
          <Link to="/seller-profile">Seller Profile</Link>
          <Link to="/add-item">Add Item</Link>
          <Link to="/upload-img">Upload image</Link>
        
        </>
      )}
      {role === "bid" && (
        <>
          <Link to="/BidDashboard">Bidder Dashboard</Link>
          <Link to="/bid-now">Bid Now</Link>
          <Link to="/shipping">Shipping Details</Link>
          <Link to="/payment">Payment</Link>
          <Link to="/bidder-profile">Profile</Link>
          <Link to="/BidFeedbackPage">Feedback</Link>

        </>
      )}
      {role === "ship" && (
        <>
          <Link to="/shipmanagedash">Shipping Dashboard</Link>
          <Link to="/shipments">Manage Shipments</Link>
          <Link to="/shippers">Manage Shipment Service Providers</Link>
         
        </>
      )}
      {role === "hr" && (
        <>
          <Link to="/employeeDashboard">Employee Management</Link>
          <Link to="/employeeReports">Employee Reports</Link>
          <Link to="/trackPerformance">Track Performance</Link>
          <Link to="/payroll">Payroll</Link>
        </>
      )}
      {role === "im" && (
        <>
          <Link to="/inspectionDashboard">Dashboard</Link>
          <Link to="/addReport">Add Report</Link>
          <Link to="/flagged-items">Report Dashboard</Link>
          <Link to="/inspectionReport">Inspection Report</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;
