import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UpdateShipment.css';

const BASE_URL = 'http://localhost:5000';

function UpdateShipment() {
  const [shipmentData, setShipmentData] = useState({
    itemid: '',
    itemname: '',
    from: '',
    collectionCenter: '',
    to: '',
    userName: '',
    selleremail: '',
    phone: '',
    buyername: '',
    buyeremail: '',
    buyerphone: '',
    weight: 0,
    shipmenttype: '',
    cost: 0,
    status: '',
    courieridToCollection: '',
    courieridToBuyer: ''
  });

  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = location.state?.shipmentData;
        if (!data) {
          const shipmentRes = await axios.get(`${BASE_URL}/shipments/${id}`);
          data = shipmentRes.data.data;
        }

        setShipmentData(prev => ({
          ...prev,
          ...data,
          weight: data.weight || 0,
          cost: data.cost || 0,
          courieridToCollection: data.courieridToCollection || '',
          courieridToBuyer: data.courieridToBuyer || ''
        }));

        const shippersRes = await axios.get(`${BASE_URL}/shippers`);
        setShippers(shippersRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load shipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.state]);

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
        [name]: name === 'weight' || name === 'cost' ? Number(value) : value
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
  };

  const handleCourierChange = async (e) => {
    const { name, value } = e.target;
    try {
      const selectedCourier = shippers.find(shipper => shipper.providerid === value);
      if (!selectedCourier) throw new Error('Courier not found');

      const calculatedCost = shipmentData.weight * selectedCourier.rateperkg;

      await axios.put(`${BASE_URL}/shipments/assign-courier`, {
        shipmentId: id,
        courierid: value,
        field: name
      });

      setShipmentData(prevState => ({
        ...prevState,
        [name]: value,
        cost:
          name === 'courieridToCollection'
            ? calculatedCost
            : prevState.cost + calculatedCost,
        status:
          name === 'courieridToCollection'
            ? 'Courier Assigned to Collection'
            : 'Courier Assigned to Buyer'
      }));

      toast.success('Courier assigned successfully');
    } catch (error) {
      console.error('Error assigning courier:', error);
      toast.error('Failed to assign courier');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/shipments/${id}`, {
        ...shipmentData,
        weight: Number(shipmentData.weight),
        cost: Number(shipmentData.cost)
      });
      toast.success('Shipment updated successfully!');
      navigate('/shipments');
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error('Failed to update shipment');
    }
  };

  if (loading) {
    return <div className="sh-loading-message">Loading shipment data...</div>;
  }

  return (
    <div className="sh-update-shipment-container">
      <h2>Update Shipment</h2>
      <form className="sh-shipment-form" onSubmit={handleSubmit}>
        {[
          ['itemid', 'Item ID', 'text', true],
          ['itemname', 'Item Name'],
          ['from', 'From'],
          ['collectionCenter', 'Collection Center'],
          ['to', 'To'],
          ['userName', 'Seller Name'],
          ['selleremail', 'Seller Email', 'email'],
          ['phone', 'Seller Phone'],
          ['buyername', 'Buyer Name'],
          ['buyeremail', 'Buyer Email', 'email'],
          ['buyerphone', 'Buyer Phone']
        ].map(([name, label, type = 'text', readOnly = false]) => (
          <div className="sh-form-group" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              name={name}
              value={shipmentData[name]}
              onChange={handleChange}
              readOnly={readOnly}
              required={!readOnly}
              className={readOnly ? 'readonly-input' : ''}
            />
          </div>
        ))}

        <div className="sh-form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
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
          <label htmlFor="courieridToCollection">Courier to Collection</label>
          <select
            name="courieridToCollection"
            value={shipmentData.courieridToCollection || ''}
            onChange={handleCourierChange}
          >
            <option value="">Select Courier</option>
            {shippers.map((shipper) => (
              <option key={shipper._id} value={shipper.providerid}>
                {shipper.companyname} ({shipper.companytype}) - ${shipper.rateperkg}/kg
              </option>
            ))}
          </select>
        </div>

        <div className="sh-form-group">
          <label htmlFor="courieridToBuyer">Courier to Buyer</label>
          <select
            name="courieridToBuyer"
            value={shipmentData.courieridToBuyer || ''}
            onChange={handleCourierChange}
          >
            <option value="">Select Courier</option>
            {shippers.map((shipper) => (
              <option key={shipper._id} value={shipper.providerid}>
                {shipper.companyname} ({shipper.companytype}) - ${shipper.rateperkg}/kg
              </option>
            ))}
          </select>
        </div>

        <div className="sh-form-group">
          <label htmlFor="cost">Cost ($)</label>
          <input
            type="number"
            name="cost"
            value={shipmentData.cost}
            readOnly
            className="readonly-input"
          />
          <small className="cost-note">
            Cost is automatically calculated based on weight and courier rates
          </small>
        </div>

        <div className="sh-form-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            value={shipmentData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Courier Assigned to Collection">Courier Assigned to Collection</option>
            <option value="Picked Up">Picked Up</option>
            <option value="At Collection Center">At Collection Center</option>
            <option value="Courier Assigned to Buyer">Courier Assigned to Buyer</option>
            <option value="Shipped to Buyer">Shipped to Buyer</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sh-form-actions">
          <button type="submit" className="sh-btn-submit">Update Shipment</button>
          <button
            type="button"
            className="sh-btn-cancel"
            onClick={() => navigate('/shipments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateShipment;
