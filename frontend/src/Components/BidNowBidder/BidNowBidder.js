import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BidNowBidderStyles.css";

const BidNowBidder = () => {
  const [currentBid, setCurrentBid] = useState(150);
  const [bidInput, setBidInput] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [outbidAlert, setOutbidAlert] = useState(false);
  const [newBid, setNewBid] = useState(null);
  const [retractAvailable, setRetractAvailable] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Countdown in seconds (30s for demo)
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setAuctionEnded(true);
      // Simulate win/lose logic (for demo: win if last bid was yours)
      setHasWon(currentBid === parseInt(bidInput) || !outbidAlert);
    }
  }, [timeLeft]);

  const placeBid = () => {
    const bidValue = parseInt(bidInput);
    if (bidValue && bidValue > currentBid) {
      setCurrentBid(bidValue);
      setConfirmation(true);
      setOutbidAlert(false);
      setRetractAvailable(true);
      setTimeout(() => setRetractAvailable(false), 300000); // 5 min retraction window
      simulateOutbid(bidValue);
    } else {
      alert("Please enter a bid higher than the current one!");
    }
  };

  const retractBid = () => {
    if (window.confirm("Are you sure you want to retract your bid?")) {
      setCurrentBid(150); // Reset to initial bid (simplified)
      setConfirmation(false);
      setOutbidAlert(false);
      setRetractAvailable(false);
    }
  };

  const simulateOutbid = (userBid) => {
    setTimeout(() => {
      const simulatedBid = userBid + 20;
      setCurrentBid(simulatedBid);
      setNewBid(simulatedBid);
      setOutbidAlert(true);
      setConfirmation(false);
    }, 5000); // Simulate outbid after 5 seconds
  };

  const handlePayNow = () => {
    navigate("/payment");
  };

  return (
    <div className="BidNowBidderWrapper">
      <main className="BidNowBidderMain">
        <div className="BidNowBidderLeft">
          <div className="BidNowBidderImageGallery">
            <img
              src="/BidImages/watch1.webp"
              alt="Watch 1"
              className="BidNowBidderZoomable"
            />
            <img
              src="/BidImages/watch2.jpg"
              alt="Watch 2"
              className="BidNowBidderZoomable"
            />
            <img
              src="/BidImages/watch3.jpg"
              alt="Watch 3"
              className="BidNowBidderZoomable"
            />
            <img
              src="/BidImages/watch4.webp"
              alt="Watch 4"
              className="BidNowBidderZoomable"
            />
          </div>
          <div className="BidNowBidderDescription">
            <h2>Description</h2>
            <p>
              This is a rare 1960s vintage watch in mint condition. Featuring a sleek stainless steel
              case, manual wind movement, and a timeless leather strap, it’s a collector’s dream.
              Perfect for enthusiasts or as a statement piece.
            </p>
          </div>
        </div>
        <div className="BidNowBidderRight">
          {!auctionEnded ? (
            <>
              <div className="BidNowBidderCountdown">
                <h3>Countdown Clock</h3>
                <p>{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</p>
              </div>
              <div className="BidNowBidderNotifications">
                {confirmation && (
                  <p className="BidNowBidderConfirmation">
                    You placed a bid of ${bidInput}
                  </p>
                )}
                {outbidAlert && (
                  <p className="BidNowBidderOutbidAlert">
                    Someone outbid you! New bid: ${newBid}
                  </p>
                )}
              </div>
              <div className="BidNowBidderBidSection">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder="Enter your bid"
                  min={currentBid + 10}
                  step="10"
                />
                <button onClick={placeBid}>Bid Now</button>
                {retractAvailable && (
                  <button onClick={retractBid} className="BidNowBidderRetractBtn">
                    Retract Bid (5 min left)
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="BidNowBidderResult">
              {hasWon ? (
                <>
                  <h3 className="BidNowBidderWinMessage">
                    Congratulations, you have won the bid!
                  </h3>
                  <p>For complete transaction, please pay now.</p>
                  <button onClick={handlePayNow} className="BidNowBidderPayNow">
                    Pay Now
                  </button>
                </>
              ) : (
                <h3 className="BidNowBidderLoseMessage">
                  Sorry, you didn’t win the bid.
                </h3>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BidNowBidder;