import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './NewShipment.css';


function NewShipment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [shippers, setShippers] = useState([]);

    const [shipmentData, setShipmentData] = useState({
        itemid: '',
        itemname: '',
        from: '',
        collectionCenter: 'Main Collection Center',
        to: '',
        userName: '',
        selleremail: '',
        phone: '',
        buyername: '',
        buyeremail: '',
        buyerphone: '',
        weight: '',
        shipmenttype: '',
        cost: '',
        status: 'Pending',
        courieridToCollection: '',
        courieridToBuyer: ''
    });

    useEffect(() => {
        const fetchShippers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/shippers');
                setShippers(res.data.data || []);
            } catch (error) {
                console.error('Error fetching shippers:', error);
                toast.error('Failed to load couriers');
            }
        };
        fetchShippers();
    }, []);

    const calculateCost = (weight, courierId) => {
        if (!weight || !courierId) return 0;
        const courier = shippers.find(s => s.providerid === courierId);
        if (!courier) return 0;
        return (weight * courier.rateperkg).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipmentData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };

            if (name === 'weight' || name === 'courieridToCollection' || name === 'courieridToBuyer') {
                const weight = name === 'weight' ? value : prev.weight;
                const courierId = name === 'courieridToCollection' ? value : prev.courieridToCollection;
                const courierToBuyerId = name === 'courieridToBuyer' ? value : prev.courieridToBuyer;

                const costToCollection = calculateCost(weight, courierId);
                const costToBuyer = calculateCost(weight, courierToBuyerId);
                const totalCost = (Number(costToCollection) + Number(costToBuyer)).toFixed(2);

                newData.cost = totalCost;
            }

            return newData;
        });

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!shipmentData.itemid.trim()) errors.itemid = 'Item ID is required';
        if (!shipmentData.itemname.trim()) errors.itemname = 'Item name is required';
        if (!shipmentData.from.trim()) errors.from = 'Pickup address is required';
        if (!shipmentData.to.trim()) errors.to = 'Delivery address is required';
        if (!shipmentData.userName.trim()) errors.userName = 'Seller name is required';
        if (!shipmentData.selleremail.trim()) errors.selleremail = 'Seller email is required';
        if (!/^\S+@\S+\.\S+$/.test(shipmentData.selleremail)) errors.selleremail = 'Invalid seller email format';
        if (!shipmentData.phone.trim()) errors.phone = 'Seller phone is required';
        if (!shipmentData.buyername.trim()) errors.buyername = 'Buyer name is required';
        if (!shipmentData.buyeremail.trim()) errors.buyeremail = 'Buyer email is required';
        if (!/^\S+@\S+\.\S+$/.test(shipmentData.buyeremail)) errors.buyeremail = 'Invalid buyer email format';
        if (!shipmentData.buyerphone.trim()) errors.buyerphone = 'Buyer phone is required';
        if (!shipmentData.weight || shipmentData.weight <= 0) errors.weight = 'Weight must be greater than 0';
        if (!shipmentData.shipmenttype) errors.shipmenttype = 'Shipment type is required';
        if (!shipmentData.courieridToCollection) errors.courieridToCollection = 'Collection courier is required';
        if (!shipmentData.courieridToBuyer) errors.courieridToBuyer = 'Delivery courier is required';
        return errors;
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
            const formattedData = {
                ...shipmentData,
                weight: Number(shipmentData.weight),
                cost: Number(shipmentData.cost),
                status: 'Pending'
            };

            const response = await axios.post('http://localhost:5000/shipments', formattedData);

            if (response.data.success) {
                toast.success('Shipment created successfully!');
                navigate('/shipments');
            } else {
                throw new Error(response.data.message || 'Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create shipment';
            toast.error(errorMessage);
            if (error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
       <div className="sh-create-shipment-container">
           
            <form className="sh-shipment-form" onSubmit={handleSubmit}>
                <h2>Create New Shipment</h2>

                <div className="sh-form-section">
                    <h3>Item Details</h3>
                    <div className="sh-form-group">
                        <label htmlFor="itemid">Item ID</label>
                        <input
                            type="text"
                            name="itemid"
                            value={shipmentData.itemid}
                            onChange={handleChange}
                            className={formErrors.itemid ? 'error' : ''}
                            required
                        />
                        {formErrors.itemid && <span className="error-message">{formErrors.itemid}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="itemname">Item Name</label>
                        <input
                            type="text"
                            name="itemname"
                            value={shipmentData.itemname}
                            onChange={handleChange}
                            className={formErrors.itemname ? 'error' : ''}
                            required
                        />
                        {formErrors.itemname && <span className="error-message">{formErrors.itemname}</span>}
                    </div>
                </div>

                <div className="sh-form-section">
                    <h3>Seller Details</h3>
                    <div className="sh-form-group">
                        <label htmlFor="userName">Seller Name</label>
                        <input
                            type="text"
                            name="userName"
                            value={shipmentData.userName}
                            onChange={handleChange}
                            className={formErrors.userName ? 'error' : ''}
                            required
                        />
                        {formErrors.userName && <span className="error-message">{formErrors.userName}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="selleremail">Seller Email</label>
                        <input
                            type="email"
                            name="selleremail"
                            value={shipmentData.selleremail}
                            onChange={handleChange}
                            className={formErrors.selleremail ? 'error' : ''}
                            required
                        />
                        {formErrors.selleremail && <span className="error-message">{formErrors.selleremail}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="phone">Seller Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={shipmentData.phone}
                            onChange={handleChange}
                            className={formErrors.phone ? 'error' : ''}
                            required
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="from">Pickup Address</label>
                        <input
                            type="text"
                            name="from"
                            value={shipmentData.from}
                            onChange={handleChange}
                            className={formErrors.from ? 'error' : ''}
                            required
                        />
                        {formErrors.from && <span className="error-message">{formErrors.from}</span>}
                    </div>
                </div>

                <div className="sh-form-section">
                    <h3>Buyer Details</h3>
                    <div className="sh-form-group">
                        <label htmlFor="buyername">Buyer Name</label>
                        <input
                            type="text"
                            name="buyername"
                            value={shipmentData.buyername}
                            onChange={handleChange}
                            className={formErrors.buyername ? 'error' : ''}
                            required
                        />
                        {formErrors.buyername && <span className="error-message">{formErrors.buyername}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="buyeremail">Buyer Email</label>
                        <input
                            type="email"
                            name="buyeremail"
                            value={shipmentData.buyeremail}
                            onChange={handleChange}
                            className={formErrors.buyeremail ? 'error' : ''}
                            required
                        />
                        {formErrors.buyeremail && <span className="error-message">{formErrors.buyeremail}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="buyerphone">Buyer Phone</label>
                        <input
                            type="tel"
                            name="buyerphone"
                            value={shipmentData.buyerphone}
                            onChange={handleChange}
                            className={formErrors.buyerphone ? 'error' : ''}
                            required
                        />
                        {formErrors.buyerphone && <span className="error-message">{formErrors.buyerphone}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="to">Delivery Address</label>
                        <input
                            type="text"
                            name="to"
                            value={shipmentData.to}
                            onChange={handleChange}
                            className={formErrors.to ? 'error' : ''}
                            required
                        />
                        {formErrors.to && <span className="error-message">{formErrors.to}</span>}
                    </div>
                </div>

                <div className="sh-form-section">
                    <h3>Shipment Details</h3>
                    <div className="sh-form-group">
                        <label htmlFor="weight">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={shipmentData.weight}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            className={formErrors.weight ? 'error' : ''}
                            required
                        />
                        {formErrors.weight && <span className="error-message">{formErrors.weight}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="shipmenttype">Shipment Type</label>
                        <select
                            name="shipmenttype"
                            value={shipmentData.shipmenttype}
                            onChange={handleChange}
                            className={formErrors.shipmenttype ? 'error' : ''}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Local">Local</option>
                            <option value="International">International</option>
                        </select>
                        {formErrors.shipmenttype && <span className="error-message">{formErrors.shipmenttype}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="courieridToCollection">Courier to Collection Center</label>
                        <select
                            name="courieridToCollection"
                            value={shipmentData.courieridToCollection}
                            onChange={handleChange}
                            className={formErrors.courieridToCollection ? 'error' : ''}
                            required
                        >
                            <option value="">Select Courier</option>
                            {shippers.map((shipper) => (
                                <option key={shipper._id} value={shipper.providerid}>
                                    {shipper.companyname} ({shipper.companytype}) - ${shipper.rateperkg}/kg
                                </option>
                            ))}
                        </select>
                        {formErrors.courieridToCollection && <span className="error-message">{formErrors.courieridToCollection}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="courieridToBuyer">Courier to Buyer</label>
                        <select
                            name="courieridToBuyer"
                            value={shipmentData.courieridToBuyer}
                            onChange={handleChange}
                            className={formErrors.courieridToBuyer ? 'error' : ''}
                            required
                        >
                            <option value="">Select Courier</option>
                            {shippers.map((shipper) => (
                                <option key={shipper._id} value={shipper.providerid}>
                                    {shipper.companyname} ({shipper.companytype}) - ${shipper.rateperkg}/kg
                                </option>
                            ))}
                        </select>
                        {formErrors.courieridToBuyer && <span className="error-message">{formErrors.courieridToBuyer}</span>}
                    </div>

                    <div className="sh-form-group">
                        <label htmlFor="cost">Total Cost ($)</label>
                        <input
                            type="number"
                            name="cost"
                            value={shipmentData.cost}
                            readOnly
                            className="readonly"
                        />
                        <small className="cost-note">Cost is automatically calculated based on weight and courier rates</small>
                    </div>
                </div>

                <div className="sh-form-actions">
                    <button type="submit" className="sh-btn-submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Shipment'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewShipment;
