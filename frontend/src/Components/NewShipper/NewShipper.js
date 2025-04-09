import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewShipper.css';

const URL = 'http://localhost:5000/shippers';

function NewShipper() {
    const navigate = useNavigate();

    const [shipper, setShipper] = useState({
        providerid: '',
        companyname: '',
        companyaddress: '',
        companyemail: '',
        companyphone: '',
        companytype: '',
        rateperkg: ''
    });

    const handleChange = (e) => {
        setShipper((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting shipper data:', shipper);
        try {
            await sendRequest();
            navigate('/shippers');
        } catch (error) {
            console.error('Error creating shipper:', error);
        }
    };

    const sendRequest = async () => {
        const response = await axios.post(URL, {
            providerid: String(shipper.providerid),
            companyname: String(shipper.companyname),
            companyaddress: String(shipper.companyaddress),
            companyemail: String(shipper.companyemail),
            companyphone: String(shipper.companyphone),
            companytype: String(shipper.companytype),
            rateperkg: Number(shipper.rateperkg)
        });
        
        console.log('Server response:', response.data);
        return response.data;
    };

    return (
        <div className="sh-create-shipper-container">
            <form className="sh-shipper-form" onSubmit={handleSubmit}>
                <h2>Create New Shipping Services Provider</h2>

                <div className="sh-form-group">
                    <label htmlFor="sh-providerid">Shipping Provider ID</label>
                    <input
                        type="text"
                        name="providerid" // Removed the id
                        value={shipper.providerid}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-companyname">Company Name</label>
                    <input
                        type="text"
                        name="companyname" // Removed the id
                        value={shipper.companyname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-companyaddress">Address</label>
                    <input
                        type="text"
                        name="companyaddress" // Removed the id
                        value={shipper.companyaddress}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-companyemail">Email Address</label>
                    <input
                        type="email"
                        name="companyemail" // Removed the id
                        value={shipper.companyemail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-companyphone">Contact Number</label>
                    <input
                        type="tel"
                        name="companyphone" // Removed the id
                        value={shipper.companyphone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-companytype">Company Type</label>
                    <select
                        name="companytype" // Removed the id
                        value={shipper.companytype}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                    </select>
                </div>

                <div className="sh-form-group">
                    <label htmlFor="sh-rateperkg">Rate per kg ($)</label>
                    <input
                        type="number"
                        name="rateperkg" // Removed the id
                        step="0.01"
                        min="0"
                        value={shipper.rateperkg}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="sh-form-actions">
                    <button type="submit" className="sh-btn-submit">
                        Add New Shipping Service Provider
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewShipper;
