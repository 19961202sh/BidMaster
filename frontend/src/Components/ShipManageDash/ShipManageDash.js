import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ShipManageDash.css'
import ViewShipDetails from './ViewShipDetails'

function ShipManageDash() {
  const [selectedShip, setSelectedShip] = useState(null)
  // Example: Replace this with your actual data source
  const shippingEntries = [
    {
      fullname: 'John Doe',
      email: 'john@example.com',
      age: 30,
      mobileNo: '1234567890',
      shippingAddress: '123 Main St, City',
      postalCode: '12345',
      country: 'Country'
    },
    // ...other entries
  ]
  
  return (
    <div className='shipdash'>
      {/* Full-width banner at the top */}
      <div className="sh-banner">
        <div className="banner-overlay">
          <h1 className="banner-title">Welcome to the Shipping Manager Dashboard</h1>
          <p className="sh-subtitle">Monitor, manage, and streamline all shipping operations efficiently</p>
        </div>
      </div>
      
      {/* Dashboard cards section */}
      <div className="sh-dashboard-container">
        <div className="sh-card">
          <div className="sh-card-image shipment-image"></div>
          <div className="sh-card-content">
            <h2 className="sh-card-title">Manage Shipments</h2>
            <p className="sh-card-description">Track and organize your shipments efficiently</p>
            <Link to="/shipments" className="sh-link">
              <span className="sh-card-button">Go to Shipments</span>
            </Link>
          </div>
        </div>
        <div className="sh-card">
          <div className="sh-card-image provider-image"></div>
          <div className="sh-card-content">
            <h2 className="sh-card-title">Manage Courier</h2>
            <p className="sh-card-description">Handle shipping service providers with ease</p>
            <Link to="/shippers" className="sh-link">
              <span className="sh-card-button">Go to Courier</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Modal for viewing details */}
      {selectedShip && (
        <ViewShipDetails
          details={selectedShip}
          onClose={() => setSelectedShip(null)}
        />
      )}
    </div>
  )
}

export default ShipManageDash