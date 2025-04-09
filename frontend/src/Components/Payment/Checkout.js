import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

const stripePromise = loadStripe('pk_test_51R6sI701w6vsd6l6490eVrZnYD9IWUkSebeCMsEWiY3QEGxuK2eXv4h6OFj0mXOEVS1T3J6yco4g806W03gG9o4z001HlK8fGs');

function Checkout() {
  const handleCheckout = async () => {
    try {
      // Robust port detection
      const port = window.location.port || (window.location.hostname === 'localhost' ? '5005' : '3000');
      console.log('Frontend port being sent:', port);
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frontendPort: port,
          items: [{ 
            name: 'Auction Item', 
            price: 1000, 
            quantity: 1 
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detailed error:', errorData);
        throw new Error(errorData.details || 'Checkout failed');
      }

      const session = await response.json();
      console.log('Checkout session:', session);
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('FULL Checkout error:', error);
      alert(`Checkout Error: ${error.message}`);
    }
  };

  return (
    <div className="PayCheckoutWrapper">
      <div className="PayCheckoutCheckoutContainer">
        <h1>Make Your Auction Payment</h1>
        <p>Please review your order before proceeding to checkout.</p>
        <div className="PayCheckoutOrderSummary">
          <h2>Order Summary</h2>
          <div className="PayCheckoutOrderItem">
            <span>Auction Item</span>
            <span>$1000.00</span>
          </div>
          <div className="PayCheckoutOrderTotal">
            <span>Total</span>
            <span>$1000.00</span>
          </div>
        </div>
        <button className="PayCheckoutCheckoutButton" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Checkout;