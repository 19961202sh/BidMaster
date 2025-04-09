import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';
import './Shippers.css';


function Shippers() {
    const [shippers, setShippers] = useState([]);

    const columns = [
        { field: 'providerid', headerName: 'Shipper ID', width: 150 },
        { field: 'companyname', headerName: 'Company Name', width: 200 },
        { field: 'companyaddress', headerName: 'Company Address', width: 200 }, // Fixed typo
        { field: 'companyemail', headerName: 'Company Email', width: 150 },
        { field: 'companyphone', headerName: 'Contact Number', width: 150 },
        { field: 'companytype', headerName: 'Company Type', width: 150 },
        { field: 'rateperkg', headerName:"Rate per kg ($)",width: 120 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 150,
            renderCell: (params) => (
                <Link to={`/shippers/${params.row._id}`}>
                    <button className="edit-button">Edit</button>
                </Link>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            renderCell: (params) => (
                <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(params.row._id)}
                />
            ),
        },
    ];

    useEffect(() => {
        const getAllShippers = async () => {
            try {
                const res = await publicRequest.get('/shippers');
                setShippers(res.data.shippers || res.data); // Handle both possible response structures
            } catch (error) {
                console.error('Error fetching shippers:', error);
            }
        };
        getAllShippers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await publicRequest.delete(`/shippers/${id}`);
            setShippers(shippers.filter(shipper => shipper._id !== id)); // Update state instead of reloading
        } catch (error) {
            console.error('Error deleting shipper:', error);
        }
    };

    return (
        <>

            
            <div className="sh-shippers-container">
                <div className="sh-shippers-wrapper">
                    <h1 className="sh-shippers-title">All Shipping Services Providers</h1>
                    <Link to="/newshipper"> {}
                        <button className="sh-new-shippers-button">
                            New Shipping Services Provider
                        </button>
                    </Link>
                </div>
                <div className="sh-shippers-grid">
                  <DataGrid
                    rows={shippers}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                                           />
               </div>
            </div>
        </>
    );
}

export default Shippers;
