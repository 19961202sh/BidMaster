import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './InspectionDashboard.css';
import pendingIcon from '../../assets/pending-icon.png';
import liveIcon from '../../assets/live-icon.png';
import rejectedIcon from '../../assets/rejected-icon.png';
import flaggedIcon from '../../assets/flagged-icon.png';
import reviewIcon from '../../assets/review-icon.png';
import viewIcon from '../../assets/view-icon.png';
import reportIcon from '../../assets/report-icon.png';
import summaryIcon from '../../assets/summary-icon.png';
import alertIcon from '../../assets/alert-icon.png';

const InspectionDashboard = () => {
  const recentActivity = [
    { id: 123, name: 'Lamp', status: 'Pending', date: '03/29/25', image: 'https://images.unsplash.com/photo-1609223732832-fd47d91a8747?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxhbXBzaGFkZXxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 124, name: 'Phone', status: 'Live', date: '03/30/25', image: 'https://images.unsplash.com/photo-1551806235-6692cbfc690b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHZpbnRhZ2UlMjBwaG9uZXxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 125, name: 'Toy Car', status: 'Flagged', date: '03/30/25', image: 'https://media.istockphoto.com/id/842671004/photo/retro-taxi.webp?a=1&b=1&s=612x612&w=0&k=20&c=DptkF2AfY5p7ZTiKUuN8yD_b-HMyzqNLyLQkyUS5p6w=' },
  ];

  const alerts = [
    'Item #123 overdue for inspection (submitted 3 days ago)',
    'Item #125 flagged as fraudulent by 2 users',
  ];

  const quickActions = [
    { title: 'Review Items', icon: reviewIcon, action: 'Review Items', link: '#' },
    { title: 'View Live Bids', icon: viewIcon, action: 'View Live Bids', link: '#' },
    { title: 'Check Reports', icon: reportIcon, action: 'Check Reports', link: '/flagged-items' },
    { title: 'Generate Summary', icon: summaryIcon, action: 'Generate Summary', link: '#' },
  ];

  const handleTileClick = (section) => console.log(`Navigating to ${section}`);
  const handleActionClick = (action) => console.log(`Action triggered: ${action}`);

  return (
    <div className="dashboard-page">
      <Nav />
      
      {/* Hero Section */}
      <section className="dash-hero-section">
      </section>

      <h1 className="dash-hero-title">Welcome, Pamodini</h1>
      <p className="dash-hero-subtitle">Your Auction Dashboard</p>

      {/* Metrics Section */}
      <section className="dash-metrics-section">
        <h2 className="dash-section-title">Dashboard Overview</h2>
        <div className="dash-metrics-grid">
          <div className="dash-metric-item" onClick={() => handleTileClick('Inspection Manager')}>
            <img src={pendingIcon} alt="Pending" className="metric-icon" />
            <h3>Pending Inspections</h3>
            <p>12 Items</p>
          </div>
          <div className="dash-metric-item" onClick={() => handleTileClick('Bidding Page')}>
            <img src={liveIcon} alt="Live" className="metric-icon" />
            <h3>Live Auctions</h3>
            <p>8 Items</p>
          </div>
          <div className="dash-metric-item" onClick={() => handleTileClick('Deleted/Rejected Page')}>
            <img src={rejectedIcon} alt="Rejected" className="metric-icon" />
            <h3>Rejected Items</h3>
            <p>5 Items</p>
          </div>
          <div className="dash-metric-item" onClick={() => handleTileClick('Reported Items Page')}>
            <img src={flaggedIcon} alt="Flagged" className="metric-icon" />
            <h3>Flagged Items</h3>
            <p>3 Items</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="dash-actions-section">
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-actions-grid">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="dash-action-card"
              onClick={() => handleActionClick(action.action)}
            >
              <img src={action.icon} alt={action.title} className="action-icon" />
              <h3>{action.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="dash-activity-section">
        <h2 className="dash-section-title">
          <img src={summaryIcon} alt="Activity" className="section-icon" />
          Recent Activity
        </h2>
        <div className="dash-activity-grid">
          {recentActivity.map((item) => (
            <div key={item.id} className="dash-activity-item">
              <img src={item.image} alt={item.name} className="activity-image" />
              <div className="activity-details">
                <h3>{item.name}</h3>
                <p>Status: {item.status}</p>
                <p>Date: {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts Section */}
      <section className="dash-alerts-section">
        <h2 className="dash-section-title">
          <img src={alertIcon} alt="Alerts" className="section-icon" />
          Alerts
        </h2>
        <div className="dash-alerts-grid">
          {alerts.map((alert, index) => (
            <div key={index} className="dash-alert-item">
              <img src={alertIcon} alt="Alert" className="alert-icon" />
              <p>{alert}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InspectionDashboard;