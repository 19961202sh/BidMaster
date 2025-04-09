
import React, { useRef } from 'react';

import emailjs from 'emailjs-com';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './ContactUs.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt,  Fa500Px, FaAddressBook } from 'react-icons/fa';


const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 7.2906,   // Kandy, Sri Lanka
  lng: 80.6336   // Kandy, Sri Lanka
};

function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_d2a9mbf', 'template_6rhsu8h', form.current, 'xny1OQT9sr9bs6fEP')
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        alert('Message sent successfully!');
        form.current.reset();
      }, (error) => {
        console.log('Error sending email:', error.text);
        alert('Failed to send message. Please try again.');
      });
  };

  return (
    <div className="contact-us-page">
      
      
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any inquiries about bidding, selling, or shipping!</p>
      </section>

      {/* Main Content */}
      <div className="contact-main-content">
        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            <form ref={form} onSubmit={sendEmail} className="contact-form">

            <label htmlFor="user_name"><FaAddressBook /> Name</label>
              <div className="form-group">
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your Name"
                  required
                />
              </div>

              <label htmlFor="user_email"><FaEnvelope /> Email</label>
              <div className="form-group">
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="Your Email"
                  required
                />
              </div>

              <label htmlFor="message"><Fa500Px/>Message</label>
              <div className="form-group">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  required
                />
              </div>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>

        {/* Contact Info Section with Image */}
        <section className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-details">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Our Team" 
              className="contact-image"
            />
            <p><FaPhone /> <strong>Phone:</strong> +94 123 456 789</p>
            <p><FaEnvelope /> <strong>Email:</strong> support@auction.com</p>
            <p><FaMapMarkerAlt /> <strong>Address:</strong> 123 Auction Lane, Kandy, Sri Lanka</p>
          </div>
          
          
        </section>
      </div>

      {/* Map Section */}
      <section className="map-section">
        <h2>Find Us Here</h2>
        <div className="map-container">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
      </section>

   
    </div>
  );
}

export default ContactUs;



