import React, { useState, useEffect } from "react";
import "./BidDashboard.css";

const BidDashboard = () => {
  const images = [
    "/BidImages/shutterstock.jpg",
    "/BidImages/antiq.jpg",
    "/BidImages/tele.jpg",
    "/BidImages/antifurnit.jpg",
    "/BidImages/watch.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);

  const [currentTime, setCurrentTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    period: "AM",
    date: "",
  });
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [currentBid, setCurrentBid] = useState(250);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bidHistory, setBidHistory] = useState([
    { bidder: "Lahiruni", amount: 200, time: "10:00 AM" },
    { bidder: "Durangi", amount: 220, time: "10:05 AM" },
    { bidder: "Poornima", amount: 250, time: "10:10 AM" },
  ]);

  // image effect
  useEffect(() => {
    const interval = setInterval(() => {
      setImageOpacity(0);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setImageOpacity(1);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // date and time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // convert 12 hr format
      hours = String(hours).padStart(2, "0");
      const date = now.toLocaleDateString(); 

      setCurrentTime({ hours, minutes, seconds, period, date });

      const endTime = new Date("April 1, 2025 12:00:00").getTime();
      if (now.getTime() > endTime) {
        setIsAuctionEnded(true);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle button click
  const handleSeeAuctionsClick = () => {
    alert("Redirecting to auctions page...");
    // Add navigation logic here if needed, e.g., useNavigate from react-router-dom
  };

  return (
    <div className="biddashboard-bid-dashboard-container">
      <header className="biddashboard-bid-header">
        <h1>Welcome To BidMaster</h1>
        <div className="biddashboard-bid-bidder-info">
          Welcome Back <span>Poornima</span>
        </div>
      </header>

      <div className="biddashboard-bid-main-content">
        <div className="biddashboard-bid-image-carousel">
          <img
            src={images[currentImageIndex]}
            alt="Auction Item"
            style={{ opacity: imageOpacity, transition: "opacity 0.5s ease" }}
          />
          <div className="biddashboard-bid-image-nav">
            {images.map((_, index) => (
              <span
                key={index}
                className={`biddashboard-bid-dot ${index === currentImageIndex ? "biddashboard-bid-active" : ""}`}
                onClick={() => {
                  setImageOpacity(0);
                  setTimeout(() => {
                    setCurrentImageIndex(index);
                    setImageOpacity(1);
                  }, 500);
                }}
              />
            ))}
          </div>
        </div>

        <div className="biddashboard-bid-auction-details">
          <h2>Current Auction: Vintage Watch</h2>
          <p>A rare vintage watch from 1960, preserved in perfect condition. This exquisite timepiece features a classic design, intricate craftsmanship, and a timeless appeal. Ideal for collectors and watch enthusiasts, this vintage gem adds elegance to any collection.</p>
          <p>
            Current Bid: <span>${currentBid.toFixed(2)}</span>
          </p>
          <p>
            Status: <span>{isAuctionEnded ? "Ended" : "Live"}</span>
          </p>
        </div>

        <div className="biddashboard-bid-bid-section-advanced">
          <div className="biddashboard-bid-countdown">
            <h3>Current Date & Time</h3>
            <div className="biddashboard-digital-clock">
              <div className="biddashboard-time">
                <span>{currentTime.hours}</span>:<span>{currentTime.minutes}</span>:
                <span>{currentTime.seconds}</span> <span>{currentTime.period}</span>
              </div>
              <div className="biddashboard-date">{currentTime.date}</div>
            </div>
          </div>

          <div className="biddashboard-bid-input">
            <div className="biddashboard-bid-bidder-test">
              <input
                type="checkbox"
                id="bid-confirm"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                disabled={isAuctionEnded}
              />
              <label htmlFor="bid-confirm">I confirm</label>
            </div>
            <button
              className="biddashboard-bid-bid-now-btn"
              onClick={handleSeeAuctionsClick}
              disabled={!isConfirmed || isAuctionEnded}
            >
              See Auctions
            </button>
          </div>

          <div className="biddashboard-bid-history">
            <h3>Bid History</h3>
            <ul>
              {bidHistory.map((bid, index) => (
                <li key={index}>
                  {bid.bidder} bid ${bid.amount.toFixed(2)} at {bid.time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDashboard;