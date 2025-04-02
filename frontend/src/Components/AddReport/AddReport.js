import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddReport.css';

function AddReport() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    ReportName: '',
    ReportReason: '',
    Date: '',
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reports', {
        ReportName: String(inputs.ReportName),
        ReportReason: String(inputs.ReportReason),
        Date: inputs.Date,
      });
      return response.data;
    } catch (error) {
      console.error('Error posting report:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      await sendRequest();
      navigate('/flagged-items');
    } catch (error) {
      alert('Failed to add report. Check console for details.');
    }
  };

  return (
    <div className="AR-add-report-page">
      <header className="AR-header-banner">
        <Nav />
        <div className="AR-header-overlay">
            <br/>
            <br/>
            <br/>
            <br/>
          <h1 className="AR-page-title">Add New Report</h1>
        </div>
      </header>
      <main className="AR-form-container">
        <form onSubmit={handleSubmit} className="AR-report-form">
          <div className="AR-form-group">
            <label htmlFor="ReportName">Report Name</label>
            <input
              type="text"
              id="ReportName"
              name="ReportName"
              onChange={handleChange}
              value={inputs.ReportName}
              required
              placeholder="Enter report name"
            />
          </div>
          <div className="AR-form-group">
            <label htmlFor="ReportReason">Report Reason</label>
            <input
              type="text"
              id="ReportReason"
              name="ReportReason"
              onChange={handleChange}
              value={inputs.ReportReason}
              required
              placeholder="Enter reason for report"
            />
          </div>
          <div className="AR-form-group">
            <label htmlFor="Date">Date</label>
            <input
              type="date"
              id="Date"
              name="Date"
              onChange={handleChange}
              value={inputs.Date}
              required
            />
          </div>
          <button type="submit" className="AR-submit-btn">Submit Report</button>
        </form>
      </main>
    </div>
  );
}

export default AddReport;