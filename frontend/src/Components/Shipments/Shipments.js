import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import './Shipments.css';

const BASE_URL = 'http://localhost:5000';

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const getAllShipments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/shipments`);
        const shipmentData = res.data.data || [];
        setShipments(Array.isArray(shipmentData) ? shipmentData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching shipments:', error);
        setError('Failed to load shipments');
        toast.error('Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };

    const getAllShippers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/shippers`);
        const shipperData = res.data.data || [];
        setShippers(Array.isArray(shipperData) ? shipperData : []);
      } catch (error) {
        console.error('Error fetching shippers:', error);
      }
    };

    getAllShipments();
    getAllShippers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        const response = await axios.delete(`${BASE_URL}/shipments/${id}`);
        if (response?.data?.success) {
          setShipments(prev => prev.filter(s => s._id !== id));
          toast.success('Shipment deleted successfully');
        } else {
          throw new Error(response?.data?.message || 'Failed to delete');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete shipment');
      }
    }
  };

  const handleAssignCourier = async (shipmentId, courierId, field) => {
    try {
      const selectedCourier = shippers.find(s => s.providerid === courierId);
      const currentShipment = shipments.find(s => s._id === shipmentId);

      if (!selectedCourier || !currentShipment) {
        throw new Error('Courier or shipment not found');
      }

      const calculatedCost = currentShipment.weight * selectedCourier.rateperkg;

      await axios.post(`${BASE_URL}/shipments/assign-courier`, {
        shipmentId,
        courierid: courierId,
        field
      });

      setShipments(prevShipments =>
        prevShipments.map(shipment =>
          shipment._id === shipmentId
            ? {
                ...shipment,
                [field]: courierId,
                cost:
                  field === 'courieridToCollection'
                    ? calculatedCost
                    : shipment.cost + calculatedCost,
                status:
                  field === 'courieridToCollection'
                    ? 'Courier Assigned to Collection'
                    : 'Courier Assigned to Buyer'
              }
            : shipment
        )
      );
      toast.success('Courier assigned successfully');
    } catch (error) {
      console.error('Assign courier error:', error);
      toast.error('Failed to assign courier');
    }
  };

  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
        const imgX = (pdfWidth - canvas.width * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, canvas.width * ratio, canvas.height * ratio);
        pdf.save('shipments-report.pdf');
        toast.success('Report downloaded successfully');
      })
      .catch((error) => {
        console.error('PDF generation error:', error);
        toast.error('Failed to generate report');
      });
  };

  const columns = [
    { field: 'itemid', headerName: 'Item ID', width: 150 },
    { field: 'itemname', headerName: 'Item Name', width: 200 },
    { field: 'from', headerName: 'From', width: 200 },
    { field: 'collectionCenter', headerName: 'Collection Center', width: 200 },
    { field: 'to', headerName: 'To', width: 200 },
    { field: 'userName', headerName: 'Seller Name', width: 150 },
    { field: 'selleremail', headerName: 'Seller Email', width: 200 },
    { field: 'phone', headerName: 'Seller Phone', width: 150 },
    { field: 'buyername', headerName: 'Buyer Name', width: 150 },
    { field: 'buyeremail', headerName: 'Buyer Email', width: 200 },
    { field: 'buyerphone', headerName: 'Buyer Phone', width: 150 },
    { field: 'weight', headerName: 'Weight (kg)', width: 120 },
    { field: 'shipmenttype', headerName: 'Type', width: 120 },
    { field: 'cost', headerName: 'Cost ($)', width: 120 },
    {
      field: 'courieridToCollection',
      headerName: 'Courier to Collection',
      width: 180,
      renderCell: (params) => (
        <select
          value={params.row.courieridToCollection || ''}
          onChange={(e) =>
            handleAssignCourier(params.row._id, e.target.value, 'courieridToCollection')
          }
          disabled={params.row.status !== 'Pending'}
        >
          <option value="">Select Courier</option>
          {shippers.map((shipper) => (
            <option key={shipper._id} value={shipper.providerid}>
              {shipper.companyname}
            </option>
          ))}
        </select>
      ),
    },
    {
      field: 'courieridToBuyer',
      headerName: 'Courier to Buyer',
      width: 180,
      renderCell: (params) => (
        <select
          value={params.row.courieridToBuyer || ''}
          onChange={(e) =>
            handleAssignCourier(params.row._id, e.target.value, 'courieridToBuyer')
          }
          disabled={params.row.status !== 'At Collection Center'}
        >
          <option value="">Select Courier</option>
          {shippers.map((shipper) => (
            <option key={shipper._id} value={shipper.providerid}>
              {shipper.companyname}
            </option>
          ))}
        </select>
      ),
    },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 150,
      renderCell: (params) => (
        <Link to={`/shipments/${params.row._id}`} state={{ shipmentData: params.row }}>
          <button className="edit-button">Edit</button>
        </Link>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <FaTrash
            className="delete-icon"
            onClick={() => handleDelete(params.row._id)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      ),
    },
  ];

  if (loading) return <div className="sh-loading-message">Loading shipments...</div>;
  if (error) return <div className="sh-error-message">{error}</div>;

  return (
    <div className="sh-shipments-container">
    
      <div className="sh-shipments-header">
        <h1 className="sh-shipments-title">Shipments</h1>
        <div className="sh-shipments-actions">
          <Link to="/newshipment">
            <button className="sh-new-shipments-button">New Shipment</button>
          </Link>
          <button type="button" className="sh-report-button" onClick={generatePDF}>
            Download Report
          </button>
        </div>
      </div>
      <div className="sh-shipments-grid" ref={pdfRef}>
        {shipments.length === 0 ? (
          <div className="sh-no-data-message">No shipments found</div>
        ) : (
          <DataGrid
            rows={shipments}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: 'normal',
                padding: '8px',
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Shipments;
