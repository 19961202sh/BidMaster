import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import './Home.css';



const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

  const auctionItems = [
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'Vintage Wooden Chair',
      currentBid: '$120',
      bids: 15,
    },
    {
      image: 'https://media.istockphoto.com/id/121025448/photo/gold-pocket-watch-and-hourglass.jpg?s=612x612&w=0&k=20&c=XtGcbw9mCbJ5ZEFMC_x9wAObdl5AtD7qOCR8jI2w2zQ=',
      title: 'Antique Pocket Watch',
      currentBid: '$250',
      bids: 22,
    },
    {
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Art Sculpture',
      currentBid: '$450',
      bids: 30,
    },
  ];

  const services = [
    {
      image: 'https://image.shutterstock.com/image-photo/crooped-shot-female-gabler-using-260nw-1477185065.jpg',
      title: 'Live Auctions',
      description: 'Participate in real-time auctions from anywhere in the world.',
    },
    {
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=300&q=80',
      title: 'Secure Transactions',
      description: 'Enjoy safe and reliable payment processing for every bid.',
    },
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
      title: 'Global Marketplace',
      description: 'Connect with a worldwide community of buyers and sellers.',
    },
  ];

  // Carousel auto-slide
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % auctionItems.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [auctionItems.length]);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const goToNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % auctionItems.length);
  const goToPrevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? auctionItems.length - 1 : prev - 1));

  const handleGetStarted = () => alert('Welcome to BidMaster! Start bidding now!');
 
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home-page">
     

      {/* Hero Section */}
      <section className="hp-hero-section" id="hero">
        <br></br>
        <br></br>
        <h1 className="hp-hero-title">Welcome to BidMaster</h1>
        <p className="hp-hero-subtitle">Experience the Ultimate Auction Adventure</p>

       
      </section>


       {/* Carousel */}
       <div className="hp-carousel">
          <button className="hp-carousel-btn prev" onClick={goToPrevImage}>←</button>
          <div className="hp-carousel-image-wrapper">
            <img
              src={auctionItems[currentImageIndex].image}
              alt={auctionItems[currentImageIndex].title}
              className="hp-carousel-image"
            />
            <div className="hp-bid-info">
              <div>
                <h3>{auctionItems[currentImageIndex].title}</h3>
                <p>Current Bid: <span>{auctionItems[currentImageIndex].currentBid}</span></p>
                <p>Bids: {auctionItems[currentImageIndex].bids}</p>
                <p className="hp-countdown">Time Left: <span>{formatTime(timeLeft)}</span></p>
              </div>
             
              <Link to="/login"><button className="hp-bid-button">Bid Now</button></Link>
            </div>
          </div>
          <button className="hp-carousel-btn next" onClick={goToNextImage}>→</button>
        </div>

        <div className="hp-hero-buttons">
        <Link to="/register"> <button className="hp-cta-button" onClick={handleGetStarted}>Get Started</button></Link>
          <button className="hp-learn-more-btn" onClick={() => scrollToSection('features')}>
            Learn More
          </button>
        </div>

      {/* Features Section */}
      <section className="hp-features-section" id="features">
        <h2 className="hp-features-title">Why BidMaster Stands Out</h2>
        <div className="hp-features-grid">
          <div className="hp-feature-item">
            <h3>Intuitive Bidding</h3>
            <p>Effortlessly place bids and track auctions with our user-friendly interface.</p>
          </div>
          <div className="hp-feature-item">
            <h3>Real-Time Insights</h3>
            <p>Stay updated with live notifications and auction progress.</p>
          </div>
          <div className="hp-feature-item">
            <h3>Trusted Security</h3>
            <p>Enjoy peace of mind with our encrypted payment system.</p>
          </div>
          <div className="hp-feature-item">
            <h3>Global Reach</h3>
            <p>Connect with buyers and sellers worldwide in one vibrant marketplace.</p>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="hp-services-section" id="services">
        <h2 className="hp-services-title">Our Services</h2>
        <div className="hp-services-grid">
          {services.map((service, index) => (
            <div key={index} className="hp-service-card">
              <img
                src={service.image}
                alt={service.title}
                className="hp-service-image"
              />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="hp-stats-section">
        <h2 className="hp-stats-title">Our Impact</h2>
        <div className="hp-stats-grid">
          <div className="hp-stat-item">
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className="hp-stat-item">
            <h3>5K+</h3>
            <p>Auctions Completed</p>
          </div>
          <div className="hp-stat-item">
            <h3>$1M+</h3>
            <p>Total Bids Value</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="hp-testimonials-section">
        <h2 className="hp-testimonials-title">What Our Users Say</h2>
        <div className="hp-testimonials-grid">
          <div className="hp-testimonial-item">
            <p>"BidMaster made selling my old guitar so easy and profitable!"</p>
            <h4>- Sarah M.</h4>
          </div>
          <div className="hp-testimonial-item">
            <p>"I found a rare collectible at an amazing price. Love this platform!"</p>
            <h4>- James T.</h4>
          </div>
        </div>
        <Link to="/aboutUs" className="hp-explore-more">Explore Our Story</Link>
      </section>
      
    </div>
  );
};

export default Home;