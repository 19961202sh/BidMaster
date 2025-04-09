import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BidShipUsersDetails.css';

const BidShipUsersDetails = () => {
  const [shipDetails, setShipDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipDetails();
  }, []);

  const fetchShipDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/bid-ship-users');
      setShipDetails(response.data.bidShipUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch shipping details. Please try again later.');
      console.error('Error fetching shipping details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (detail) => {
    navigate('/BidShipProfile', { state: { editDetail: detail } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bid-ship-users/${id}`);
      fetchShipDetails();
    } catch (err) {
      setError('Failed to delete shipping detail.');
      console.error('Error deleting shipping detail:', err);
    }
  };

  const handleAdd = () => {
    navigate('/BidShipProfile');
  };

  if (loading) {
    return <div className="BidShipUserDetailsLoading">Loading shipping details...</div>;
  }

  return (
    <div className="BidShipUserDetailsWrapper">
      <div className="BidShipUserDetailsContainer">
        <h1>All Previous Bid Ship Users Details</h1>
        
        {error && <div className="BidShipUserDetailsErrorMessage">{error}</div>}
        
        <div className="BidShipUserDetailsShipDetailsList">
          {shipDetails.length === 0 ? (
            <p className="BidShipUserDetailsNoDetails">No shipping details found. Add some to get started.</p>
          ) : (
            <div className="BidShipUserDetailsShipDetailCards">
              {shipDetails.map((detail) => (
                <div key={detail._id} className="BidShipUserDetailsShipDetailCard">
                  <h3>{detail.fullname}</h3>
                  <p><span>Email:</span> {detail.email}</p>
                  <p><span>Age:</span> {detail.age}</p>
                  <p><span>Mobile:</span> {detail.mobileNo}</p>
                  <p><span>Shipping Address:</span> {detail.shippingAddress}</p>
                  <p><span>Postal Code:</span> {detail.postalCode}</p>
                  <p><span>Country:</span> {detail.country}</p>
                  <div className="BidShipUserDetailsCardActions">
                    <button className="BidShipUserDetailsBtnUpdate" onClick={() => handleUpdate(detail)}>
                      Update
                    </button>
                    <button className="BidShipUserDetailsBtnDelete" onClick={() => handleDelete(detail._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="BidShipUserDetailsBtnAdd" onClick={handleAdd}>
            Add New Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidShipUsersDetails;