import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewShipment.css';

const URL = "http://localhost:5000/shipments";

function NewShipment() {
    const navigate = useNavigate();
    
    // Fixed variable name from shipment to shipmentData
    const [shipmentData, setShipmentData] = useState({
        itemid: "",
        itemname: "",
        from: "",
        to: "",
        sellername: "",
        selleremail: "",
        sellerphone: "",
        buyername: "",
        buyeremail: "",
        buyerphone: "",
        weight: "",
        shipmenttype: "",
        cost: ""
    });

    // Fixed function name consistency
    const handleChange = (e) => {
        setShipmentData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendRequest();
            navigate("/shipments");
        } catch (error) {
            console.error("Error creating shipment:", error);
        }
    };

    const sendRequest = async () => {
        await axios.post(URL, {
            itemid: String(shipmentData.itemid),
            itemname: String(shipmentData.itemname),
            from: String(shipmentData.from),
            to: String(shipmentData.to),
            sellername: String(shipmentData.sellername),
            selleremail: String(shipmentData.selleremail),
            sellerphone: String(shipmentData.sellerphone),
            buyername: String(shipmentData.buyername),
            buyeremail: String(shipmentData.buyeremail),
            buyerphone: String(shipmentData.buyerphone),
            weight: Number(shipmentData.weight),
            shipmenttype: String(shipmentData.shipmenttype),
            cost: Number(shipmentData.cost)
        });
    };

    return (
        <div className="sh-create-shipment-container">
            <form className="sh-shipment-form" onSubmit={handleSubmit}>
                <h2>Create New Shipment</h2>
                
                <div className="sh-form-group">
                    <label htmlFor="itemid">Item ID</label>
                    <input
                        type="text"
                        id="sh-itemid"
                        name="itemid"
                        value={shipmentData.itemid}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="sh-form-group">
                    <label htmlFor="sh-itemname">Item Name</label>
                    <input
                        type="text"
                        id="sh-itemname"
                        name="itemname"
                        value={shipmentData.itemname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="from">From</label>
                    <input
                        type="text"
                        id="sh-from"
                        name="from"
                        value={shipmentData.from}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="to">To</label>
                    <input
                        type="text"
                        id="sh-to"
                        name="to"
                        value={shipmentData.to}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sellername">Seller Name</label>
                    <input
                        type="text"
                        id="sh-sellername"
                        name="sellername"
                        value={shipmentData.sellername}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="selleremail">Seller Email</label>
                    <input
                        type="email"
                        id="sh-selleremail"
                        name="selleremail"
                        value={shipmentData.selleremail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sellerphone">Seller Phone</label>
                    <input
                        type="text"
                        id="sh-sellerphone"
                        name="sellerphone"
                        value={shipmentData.sellerphone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="buyername">Buyer Name</label>
                    <input
                        type="text"
                        id="sh-buyername"
                        name="buyername"
                        value={shipmentData.buyername}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="buyeremail">Buyer Email</label>
                    <input
                        type="email"
                        id="sh-buyeremail"
                        name="buyeremail"
                        value={shipmentData.buyeremail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="buyerphone">Buyer Phone</label>
                    <input
                        type="text"
                        id="sh-buyerphone"
                        name="buyerphone"
                        value={shipmentData.buyerphone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="weight">Weight (g)</label>
                    <input
                        type="number"
                        id="sh-weight"
                        name="weight"
                        value={shipmentData.weight}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="shipmenttype">Shipment Type</label>
                    <select
                        id="sh-shipmenttype"
                        name="shipmenttype"
                        value={shipmentData.shipmenttype}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                    </select>
                </div>

                <div className="sh-form-group">
                    <label htmlFor="cost">Cost ($)</label>
                    <input
                        type="number"
                        id="sh-cost"
                        name="cost"
                        value={shipmentData.cost}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="sh-form-actions">
                    <button type="submit" className="sh-btn-submit">Create Shipment</button>
                </div>
            </form>
        </div>
    );
}

export default NewShipment;

/*import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import './NewShipment.css'
import { useEffect } from 'react'
import shipment from './Shipments/Shipments'
const URL = "http://localhost:5000/shipments";

function NewShipment() {
    const history = useNavigate();

    const [shipment, setShipment] = useState({
        itemID: "",
        itemName: "",
        from: "",
        to: "",
        sellername: "",
        selleremail: "",
        sellerphone: "",
        buyername: "",
        buyeremail: "",
        buyerphone: "",
        weight: "",
        shipmenttype: "",
        cost: "",
    });
    const handlechange = (e) => {
        setShipment((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(shipment);
        sendRequest().then(() => history("/shipments"));
        
    };

    const sendRequest = async () => {
        await axios.post("http://localhost:5000/shipments", {
            itemID: String(shipment.itemID),
            itemName: String(shipment.itemName),
            from: String(shipment.from),
            to: String(shipment.to),
            sellername: String(shipment.sellername),
            selleremail: String(shipment.selleremail),
            sellerphone: String(shipment.sellerphone),
            buyername: String(shipment.buyername),
            buyeremail: String(shipment.buyeremail),
            buyerphone: String(shipment.buyerphone),
            weight: Number(shipment.weight),
            shipmenttype: String(shipment.shipmenttype),
            cost: Number(shipment.cost)

        }).then((res) => res.data);
    }

  return (
    <div>
              
              <div className="create-shipment-container">
              <form className="shipment-form" onSubmit={handleSubmit}>
                <h2>Create New Shipment</h2>
                
                <div className="form-group">
                    <label htmlFor="itemId">Item ID</label>
                    <input
                      type="text"
                      id="itemId"
                      name="itemId"
                      value={shipmentData.itemID}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="itemName">Item Name</label>
                    <input
                      type="text"
                      id="itemName"
                      name="itemName"
                      value={shipmentData.itemName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="from">From</label>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      value={shipmentData.from}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="to">To</label>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      value={shipmentData.to}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="senderEmail">Sender Email</label>
                    <input
                      type="email"
                      id="senderEmail"
                      name="senderEmail"
                      value={shipmentData.senderEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="receiverEmail">Receiver Email</label>
                    <input
                      type="email"
                      id="receiverEmail"
                      name="receiverEmail"
                      value={shipmentData.receiverEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group full-width">
                    <label htmlFor="senderAddress">Sender Address</label>
                    <textarea
                      id="senderAddress"
                      name="senderAddress"
                      value={shipmentData.senderAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group full-width">
                    <label htmlFor="receiverAddress">Receiver Address</label>
                    <textarea
                      id="receiverAddress"
                      name="receiverAddress"
                      value={shipmentData.receiverAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="weight">Weight (g)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={shipmentData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      required
                    />
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="type">Shipment Type</label>
                    <select
                      id="type"
                      name="type"
                      value={shipmentData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="local">Local</option>
                      <option value="international">International</option>
                    </select>
                  </div>
        
                  <div className="form-group">
                    <label htmlFor="cost">Cost ($)</label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={shipmentData.cost}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
        
                 
                </div>
              </form>
        
                <div className="form-actions">
                  <button type="submit" className="btn-submit">Create Shipment</button>
                </div>
              </div>
            </div>
  )
}

export default NewShipment*/
