import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './UpdateReport.css'; // Import the CSS file

function UpdateReport() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { _id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/reports/${_id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.report));
    };
    fetchHandler();
  }, [_id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/reports/${_id}`, {
      ReportName: String(inputs.ReportName),
      ReportReason: String(inputs.ReportReason),
      Date: inputs.Date,
    }).then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      await sendRequest();
      navigate('/flagged-items');
    } catch (error) {
      alert('Failed to update report. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="UR-update-report-page">
      <Nav />
      <br />
      <br />
      <br />
      <br />
      <h1 className="UR-page-title">Update Report</h1>
      <main className="AR-form-container">
        <form onSubmit={handleSubmit} className="AR-report-form">
          <div className="AR-form-group">
            <label htmlFor="ReportName">Report Name</label>
            <input
              type="text"
              id="ReportName"
              name="ReportName"
              onChange={handleChange}
              value={inputs.ReportName || ''}
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
              value={inputs.ReportReason || ''}
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
              value={inputs.Date || ''}
              required
            />
          </div>
          <button type="submit" className="AR-submit-btn">Submit Report</button>
        </form>
      </main>
    </div>
  );
}

export default UpdateReport;