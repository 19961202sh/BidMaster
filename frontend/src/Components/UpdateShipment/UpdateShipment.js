import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateShipment.css';

const URL = "http://localhost:5000/shipments";

function UpdateShipment() {
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
        weight: 0,
        shipmenttype: "",
        cost: 0
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`${URL}/${id}`);
                setShipmentData(res.data.shipments || res.data);
            } catch (error) {
                console.error("Error fetching shipment:", error);
            }
        };
        fetchHandler();
    }, [id]);

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
            navigate('/shipments');
        } catch (error) {
            console.error('Error updating shipments:', error);
        }
    };

    const sendRequest = async () => {
            await axios.put(`${URL}/${id}`, {
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
        <div classname="upshipm">
            <div className="sh-update-shipment-container">
                <form className="sh-shipment-form" onSubmit={handleSubmit}>
                    <h2>Update Shipment</h2>
                    <div className="sh-form-group">
                        <label htmlFor="itemid">Item ID</label>
                        <input type="text" id="sh-itemid" name="sh-itemid" value={shipmentData.itemid || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="itemname">Item Name</label>
                        <input type="text" id="sh-itemname" name="sh-itemname" value={shipmentData.itemname || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="sh-from">From</label>
                        <input type="text" id="sh-from" name="sh-from" value={shipmentData.from || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="to">To</label>
                        <input type="text" id="sh-to" name="sh-to" value={shipmentData.to || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="sellername">Seller Name</label>
                        <input type="text" id="sh-sellername" name="sh-sellername" value={shipmentData.sellername || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="selleremail">Seller Email</label>
                        <input type="email" id="sh-selleremail" name="sh-selleremail" value={shipmentData.selleremail || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerphone">Seller Phone</label>
                        <input type="text" id="sh-sellerphone" name="sh-sellerphone" value={shipmentData.sellerphone || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="buyername">Buyer Name</label>
                        <input type="text" id="sh-buyername" name="sh-buyername" value={shipmentData.buyername || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="buyeremail">Buyer Email</label>
                        <input type="email" id="sh-buyeremail" name="sh-buyeremail" value={shipmentData.buyeremail || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="buyerphone">Buyer Phone</label>
                        <input type="text" id="sh-buyerphone" name="sh-buyerphone" value={shipmentData.buyerphone || ''} onChange={handleChange} required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="weight">Weight (g)</label>
                        <input type="number" id="sh-weight" name="sh-weight" value={shipmentData.weight || ''} onChange={handleChange} step="0.1" min="0" required />
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="shipmenttype">Shipment Type</label>
                        <select id="sh-shipmenttype" name="sh-shipmenttype" value={shipmentData.shipmenttype || ''} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Local">Local</option>
                            <option value="International">International</option>
                        </select>
                    </div>
                    <div className="sh-form-group">
                        <label htmlFor="cost">Cost ($)</label>
                        <input type="number" id="sh-cost" name="sh-cost" value={shipmentData.cost || ''} onChange={handleChange} step="0.01" min="0" required />
                    </div>
                    <div className="sh-form-actions">
                        <button type="submit" className="sh-btn-submit" onClick={() => navigate("/shipments")}>Update Shipment</button>
                        <button type="button" className="sh-btn-cancel" onClick={() => navigate("/shipments")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateShipment;

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateShipment.css';

const URL = "http://localhost:5000/shipments";

function UpdateShipment() {
    const [shipmentData, setShipmentData] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`${URL}/${id}`);
                setShipmentData(res.data.shipments || res.data); // Handle possible response structure
            } catch (error) {
                console.error("Error fetching shipment:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setShipmentData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const sendRequest = async () => {
        await axios.put(`${URL}/${id}`, {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendRequest();
            navigate("/shipments");
        } catch (error) {
            console.error("Error updating shipment:", error);
        }
    };

    return (
        <div className="update-shipment-container">
            <form className="shipment-form" onSubmit={handleSubmit}>
                <h2>Update Shipment</h2>
                
                <div className="form-group">
                    <label htmlFor="itemid">Item ID</label>
                    <input
                        type="text"
                        id="itemid"
                        name="itemid"
                        value={shipmentData.itemid || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="itemname">Item Name</label>
                    <input
                        type="text"
                        id="itemname"
                        name="itemname"
                        value={shipmentData.itemname || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="from">From</label>
                    <input
                        type="text"
                        id="from"
                        name="from"
                        value={shipmentData.from || ''}
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
                        value={shipmentData.to || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sellername">Seller Name</label>
                    <input
                        type="text"
                        id="sellername"
                        name="sellername"
                        value={shipmentData.sellername || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="selleremail">Seller Email</label>
                    <input
                        type="email"
                        id="selleremail"
                        name="selleremail"
                        value={shipmentData.selleremail || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sellerphone">Seller Phone</label>
                    <input
                        type="text"
                        id="sellerphone"
                        name="sellerphone"
                        value={shipmentData.sellerphone || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="buyername">Buyer Name</label>
                    <input
                        type="text"
                        id="buyername"
                        name="buyername"
                        value={shipmentData.buyername || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="buyeremail">Buyer Email</label>
                    <input
                        type="email"
                        id="buyeremail"
                        name="buyeremail"
                        value={shipmentData.buyeremail || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="buyerphone">Buyer Phone</label>
                    <input
                        type="text"
                        id="buyerphone"
                        name="buyerphone"
                        value={shipmentData.buyerphone || ''}
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
                        value={shipmentData.weight || ''}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="shipmenttype">Shipment Type</label>
                    <select
                        id="shipmenttype"
                        name="shipmenttype"
                        value={shipmentData.shipmenttype || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="cost">Cost ($)</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={shipmentData.cost || ''}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">Update Shipment</button>
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => navigate("/shipments")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateShipment;

/*import React from 'react'
import './UpdateShipment.css'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const URL = "http://localhost:5000/shipments";

function UpdateShipment() {

    const [shipment, setShipment] = useState({});
    const { id } = useParams();
    const history = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            return await axios.get(`http://localhost:5000/shipments/${id}`)
            .then((res) => res.data)
            .then((data) => setShipment(data));
        };
        fetchHandler();
    },[id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/shipments/${id}`, {

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

        const handleChange = (e) => {
            setShipment((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(shipment);
        sendRequest().then(() => history("/shipments"));
    };

  return (
    <div>
    <div className="update-shipment-container">
        <form className="shipment-form" onSubmit={handleSubmit}>
            <h2>Update Shipment</h2>
            
            <div className="form-group">
                <label htmlFor="itemID">Item ID</label>
                <input
                    type="text"
                    id="itemID"
                    name="itemID"
                    value={shipment.itemID}
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
                    value={shipment.itemName}
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
                        value={shipment.from}
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
                        value={shipment.to}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="sellername">Seller Name</label>
                    <input
                        type="text"
                        id="sellername"
                        name="sellername"
                        value={shipment.sellername}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="buyername">Buyer Name</label>
                    <input
                        type="text"
                        id="buyername"
                        name="buyername"
                        value={shipment.buyername}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="selleremail">Seller Email</label>
                    <input
                        type="email"
                        id="selleremail"
                        name="selleremail"
                        value={shipment.selleremail}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="buyeremail">Buyer Email</label>
                    <input
                        type="email"
                        id="buyeremail"
                        name="buyeremail"
                        value={shipment.buyeremail}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="sellerphone">Seller Phone</label>
                    <input
                        type="text"
                        id="sellerphone"
                        name="sellerphone"
                        value={shipment.sellerphone}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="buyerphone">Buyer Phone</label>
                    <input
                        type="text"
                        id="buyerphone"
                        name="buyerphone"
                        value={shipment.buyerphone}
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
                        value={shipment.weight}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        required
                    />
                </div>
        
                <div className="form-group">
                    <label htmlFor="shipmenttype">Shipment Type</label>
                    <select
                        id="shipmenttype"
                        name="shipmenttype"
                        value={shipment.shipmenttype}
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
                        value={shipment.cost}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="btn-submit">Update Shipment</button>
                <button type="button" className="btn-cancel" onClick={() => navigate("/shipments")}>
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>
  )
}

export default UpdateShipment
*/