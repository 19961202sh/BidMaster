import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './Shippers.css';


const Shippers = () => {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShippers();
  }, []);

  const fetchShippers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/shippers');
      if (res.data && res.data.success) {
        setShippers(res.data.data || []);
        setError(null);
      } else {
        throw new Error(res.data?.message || 'Failed to fetch couriers');
      }
    } catch (error) {
      console.error('Error fetching shippers:', error);
      setError(error.response?.data?.message || 'Failed to load couriers');
      toast.error(error.response?.data?.message || 'Failed to load couriers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this courier?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/shippers/${id}`);
        if (response.data && response.data.success) {
          setShippers(prevShippers => prevShippers.filter(shipper => shipper._id !== id));
          toast.success('Courier deleted successfully');
        } else {
          throw new Error(response.data?.message || 'Failed to delete courier');
        }
      } catch (error) {
        console.error('Error deleting courier:', error);
        toast.error(error.response?.data?.message || 'Failed to delete courier');
      }
    }
  };

  const handleEdit = (id) => {
    const shipper = shippers.find(s => s._id === id);
    if (shipper) {
      navigate(`/shippers/${id}`, { state: { shipperData: shipper } });
    } else {
      toast.error('Courier data not found');
    }
  };

  const columns = [
    { field: 'providerid', headerName: 'Courier ID', width: 150 },
    { field: 'companyname', headerName: 'Company Name', width: 200 },
    { field: 'companyaddress', headerName: 'Address', width: 250 },
    { field: 'companyemail', headerName: 'Email', width: 200 },
    { field: 'companyphone', headerName: 'Phone', width: 150 },
    { field: 'companytype', headerName: 'Type', width: 120 },
    { field: 'rateperkg', headerName: 'Rate per kg ($)', width: 150 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params) => (
        <button 
          className="edit-button"
          onClick={() => handleEdit(params.row._id)}
        >
          Edit
        </button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      renderCell: (params) => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          <FaTrash
            className="delete-icon"
            onClick={() => handleDelete(params.row._id)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      ),
    },
  ];

  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('couriers-report.pdf');
      toast.success('Report downloaded successfully');
    }).catch(error => {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report');
    });
  };

  if (loading) {
    return <div className="sh-loading-message">Loading couriers...</div>;
  }

  if (error) {
    return <div className="sh-error-message">{error}</div>;
  }

  return (
    <div className="sh-shippers-container">
     
      <div className="sh-shippers-header">
        <h1 className="sh-shippers-title">Couriers</h1>
        <div className="sh-shippers-actions">
          <Link to="/newshipper">
            <button className="sh-new-shippers-button">
              New Courier
            </button>
          </Link>
          <button 
            type="button"
            className="sh-report-button" 
            onClick={generatePDF}
          >
            Download Report
          </button>
        </div>
      </div>
      
      <div className="sh-shippers-grid" ref={pdfRef}>
        <DataGrid
          rows={shippers}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          error={error}
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
      </div>
    </div>
  );
};

export default Shippers;
