import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateShipper.css'; // Added CSS import

const URL = 'http://localhost:5000/shippers'; // Fixed URL (removed trailing slash)

function UpdateShipper() {
    const [shipperData, setShipperData] = useState({
        providerid: '',
        companyname: '',
        companyaddress: '',
        companyemail: '',
        companyphone: '',
        companytype: '',
        rateperkg: '', // Added rateperkg
    });
    const { id } = useParams(); // Get the shipper ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`${URL}/${id}`);
                setShipperData(res.data.shippers || res.data); // Handle possible response structure
            } catch (error) {
                console.error('Error fetching shipper:', error);
            }
        };
        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setShipperData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const sendRequest = async () => {
        await axios.put(`${URL}/${id}`, {
            providerid: String(shipperData.providerid),
            companyname: String(shipperData.companyname),
            companyaddress: String(shipperData.companyaddress),
            companyemail: String(shipperData.companyemail),
            companyphone: String(shipperData.companyphone),
            companytype: String(shipperData.companytype),
            rateperkg: String(shipperData.rateperkg), // Added rateperkg
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendRequest();
            navigate('/shippers');
        } catch (error) {
            console.error('Error updating shipper:', error);
        }
    };

    return (
        <div className="sh-create-shipper-container">
            <form className="sh-shipper-form" onSubmit={handleSubmit}>
                <h2>Update Shipping Service Provider</h2>

                <div className="sh-form-group">
                    <label htmlFor="providerid">Shipping Provider ID</label>
                    <input
                        type="text"
                        id="sh-providerid"
                        name="sh-providerid"
                        value={shipperData.providerid || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyname">Company Name</label>
                    <input
                        type="text"
                        id="sh-companyname"
                        name="companyname"
                        value={shipperData.companyname || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyaddress">Address</label>
                    <input
                        type="text"
                        id="sh-companyaddress"
                        name="companyaddress"
                        value={shipperData.companyaddress || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyemail">Email Address</label>
                    <input
                        type="email"
                        id="sh-companyemail"
                        name="companyemail"
                        value={shipperData.companyemail || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyphone">Contact Number</label>
                    <input
                        type="tel"
                        id="sh-companyphone"
                        name="companyphone"
                        value={shipperData.companyphone || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companytype">Company Type</label>
                    <select
                        id="sh-companytype"
                        name="companytype"
                        value={shipperData.companytype || ''} // Fixed to use shipperData with fallback
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                    </select>
                </div>

                <div className="sh-form-group">
                        <label htmlFor="rateperkg">Cost ($)</label>
                        <input type="number" id="sh-rateperkg" name="rateperkg" value={shipperData.rateperkg || ''} onChange={handleChange} step="0.01" min="0" required />
                    </div>



                <div className="sh-form-actions">
                    <button type="submit" className="sh-btn-submit">
                        Update Shipping Service Provider
                    </button>
                    <button
                        type="button"
                        className="sh-btn-cancel"
                        onClick={() => navigate('/shippers')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateShipper;

/* 
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

const URL = "http://localhost:5000/shippers/";

function UpdateShipper() {

    const [shipperData, setShipperData] = useState({});
    const {id} = useParams(); // Get the shipper ID from the URL
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`${URL}/${id}`);
                setShipperData(res.data.shippers || res.data); // Handle possible response structure
            } catch (error) {
                console.error("Error fetching shipment provider:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setShipperData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const sendRequest = async (e) => {
        await axios.put(`${URL}/${id}`, {
            providerid: String(shipperData.providerid),
            companyname: String(shipperData.companyname),
            companyaddress: String(shipperData.companyaddress),
            companyemail: String(shipperData.companyemail),
            companyphone: String(shipperData.companyphone),
            companytype: String(shipperData.companytype),
            
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendRequest();
            navigate("/shippers");
        } catch (error) {
            console.error("Error updating shipment provider:", error);
        }
    };

  return (

    <div className="create-shipper-container">
    <form className="shipper-form" onSubmit={handleSubmit}>
        <h2>Update Shipping Service Provider </h2>

        <div className="form-group">
            <label htmlFor="providerid">Shipping Provider ID</label>
            <input
                type="text"
                id="providerid"
                name="providerid"
                value={shipper.providerid} // Fixed to use shipper
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="companyname">Company Name</label>
            <input
                type="text"
                id="companyname"
                name="companyname"
                value={shipper.companyname} // Fixed to use shipper
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="companyaddress">Address</label>
            <input
                type="text"
                id="companyaddress"
                name="companyaddress"
                value={shipper.companyaddress} // Fixed to use shipper
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="companyemail">Email Address</label>
            <input
                type="email"
                id="companyemail"
                name="companyemail"
                value={shipper.companyemail} // Fixed to use shipper
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="companyphone">Contact Number</label>
            <input
                type="tel" // Changed to "tel" for phone numbers
                id="companyphone"
                name="companyphone"
                value={shipper.companyphone} // Fixed to use shipper
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="companytype">Company Type</label>
            <select
                id="companytype"
                name="companytype"
                value={shipper.companytype} // Fixed to use shipper
                onChange={handleChange}
                required
            >
                <option value="">Select Type</option> {/* Added default option */
              /*  <option value="Local">Local</option>
                <option value="International">International</option>
            </select>
        </div>

        <div className="form-actions">
            <Link to="/shippers">
            <button type="submit" className="btn-submit">
                Update Shipping Service Provider {/* Fixed button label */
         /*   </button>
            </Link>
        </div>
    </form>
</div>
  )
}

export default UpdateShipper*/

