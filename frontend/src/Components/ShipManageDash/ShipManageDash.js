import React from 'react'
import { Link } from 'react-router-dom'
import './ShipManageDash.css'

function ShipManageDash() {
  return (
    <div  className='shipdash'>
      
    <div class="sh-dashboard-container">
        <div class="sh-card">
            <div class="sh-card-image shipment-image"></div>
            <div class="sh-card-content">
                <h2 class="sh-card-title">Manage Shipments</h2>
                <p class="sh-card-description">Track and organize your shipments efficiently</p>
                <Link to="/shipments" className="sh-link">
                    <a href="#" class="sh-card-button">Go to Shipments</a></Link>
            </div>
        </div>
        <div class="sh-card">
            <div class="sh-card-image provider-image"></div>
            <div class="sh-card-content">
                <h2 class="sh-card-title">Manage Providers</h2>
                <p class="sh-card-description">Handle shipping service providers with ease</p>
                <Link to="/shippers" className="sh-link">
                    <a href="#" class="sh-card-button">Go to Providers</a></Link>
                    
                
            </div>
        </div>
    </div>

    </div>
  )
}

export default ShipManageDash
