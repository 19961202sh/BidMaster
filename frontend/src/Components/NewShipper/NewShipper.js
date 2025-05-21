import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './NewShipper.css';


function NewShipper() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [shipper, setShipper] = useState({
        providerid: '',
        companyname: '',
        companyaddress: '',
        companyemail: '',
        companyphone: '',
        companytype: '',
        rateperkg: ''
    });

    const validateForm = () => {
        const errors = {};
        if (!shipper.providerid.trim()) errors.providerid = 'Courier ID is required';
        if (!shipper.companyname.trim()) errors.companyname = 'Company name is required';
        if (!shipper.companyaddress.trim()) errors.companyaddress = 'Address is required';
        if (!shipper.companyemail.trim()) errors.companyemail = 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(shipper.companyemail)) errors.companyemail = 'Invalid email format';
        if (!shipper.companyphone.trim()) errors.companyphone = 'Phone number is required';
        if (!shipper.companytype) errors.companytype = 'Company type is required';
        if (!shipper.rateperkg || shipper.rateperkg <= 0) errors.rateperkg = 'Rate must be greater than 0';
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipper(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/shippers', {  // Change URL to your backend endpoint
                providerid: shipper.providerid.trim(),
                companyname: shipper.companyname.trim(),
                companyaddress: shipper.companyaddress.trim(),
                companyemail: shipper.companyemail.trim(),
                companyphone: shipper.companyphone.trim(),
                companytype: shipper.companytype,
                rateperkg: Number(shipper.rateperkg)
            });

            if (response.data.success) {
                toast.success('Courier added successfully!');
                navigate('/shippers');
            } else {
                throw new Error(response.data.message || 'Failed to add courier');
            }
        } catch (error) {
            console.error('Error creating shipper:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add courier';
            toast.error(errorMessage);
            if (error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sh-create-shipper-container">
           
            <form className="sh-shipper-form" onSubmit={handleSubmit}>
                <h2>Create New Courier</h2>

                <div className="sh-form-group">
                    <label htmlFor="providerid">Courier ID</label>
                    <input
                        type="text"
                        name="providerid"
                        value={shipper.providerid}
                        onChange={handleChange}
                        className={formErrors.providerid ? 'error' : ''}
                        required
                    />
                    {formErrors.providerid && <span className="error-message">{formErrors.providerid}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyname">Company Name</label>
                    <input
                        type="text"
                        name="companyname"
                        value={shipper.companyname}
                        onChange={handleChange}
                        className={formErrors.companyname ? 'error' : ''}
                        required
                    />
                    {formErrors.companyname && <span className="error-message">{formErrors.companyname}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyaddress">Address</label>
                    <input
                        type="text"
                        name="companyaddress"
                        value={shipper.companyaddress}
                        onChange={handleChange}
                        className={formErrors.companyaddress ? 'error' : ''}
                        required
                    />
                    {formErrors.companyaddress && <span className="error-message">{formErrors.companyaddress}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyemail">Email Address</label>
                    <input
                        type="email"
                        name="companyemail"
                        value={shipper.companyemail}
                        onChange={handleChange}
                        className={formErrors.companyemail ? 'error' : ''}
                        required
                    />
                    {formErrors.companyemail && <span className="error-message">{formErrors.companyemail}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companyphone">Contact Number</label>
                    <input
                        type="tel"
                        name="companyphone"
                        value={shipper.companyphone}
                        onChange={handleChange}
                        className={formErrors.companyphone ? 'error' : ''}
                        required
                    />
                    {formErrors.companyphone && <span className="error-message">{formErrors.companyphone}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="companytype">Company Type</label>
                    <select
                        name="companytype"
                        value={shipper.companytype}
                        onChange={handleChange}
                        className={formErrors.companytype ? 'error' : ''}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                    </select>
                    {formErrors.companytype && <span className="error-message">{formErrors.companytype}</span>}
                </div>

                <div className="sh-form-group">
                    <label htmlFor="rateperkg">Rate per kg ($)</label>
                    <input
                        type="number"
                        name="rateperkg"
                        step="0.01"
                        min="0"
                        value={shipper.rateperkg}
                        onChange={handleChange}
                        className={formErrors.rateperkg ? 'error' : ''}
                        required
                    />
                    {formErrors.rateperkg && <span className="error-message">{formErrors.rateperkg}</span>}
                </div>

                <div className="sh-form-actions">
                    <button type="submit" className="sh-btn-submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add New Courier'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewShipper;
