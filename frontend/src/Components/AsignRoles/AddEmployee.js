import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";
import { IoIosArrowBack } from 'react-icons/io'; 

const AddEmployee = () => {
  const navigate = useNavigate();
  const [inputs, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    salary: "",
    role: "",
    department: "",
    task: "",
  });

  const handleChange = (e) => {
    setFormData({ ...inputs, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(inputs.phone)) {
      alert("Please enter a valid 10-digit phone number without characters.");
      return;
    }

    if (!validateEmail(inputs.email)) {
      alert("Please enter a valid email address ending with '.com'.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Employee added successfully!");
      setFormData({ employeeId: "", name: "", email: "", phone: "", address: "", salary: "", role: "", department: "", task: "" });
      navigate("/employeeDashboard", { state: { refresh: true } });
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="addEmp-container">
      <div className="addEmp-box">
        <div className="updateEmp-header">
          {/* Go Back Button */}
          <button onClick={() => navigate(-1)} className="go-back-button">
            <IoIosArrowBack /> 
          </button>
        </div>

        <h2 className="addEmp-header">Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="addEmp-form">
            {/* Row 1: Employee ID and Name */}
            <div className="input-row">
              <div>
                <label>Employee ID:</label>
                <input
                  type="text"
                  name="employeeId"
                  value={inputs.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Email and Phone Number */}
            <div className="input-row">
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={inputs.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3: Address (full width) */}
            <div>
              <label>Address:</label>
              <textarea
                name="address"
                value={inputs.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Row 4: Salary and Role */}
            <div className="input-row">
              <div>
                <label>Salary:</label>
                <input
                  type="text"
                  name="salary"
                  value={inputs.salary}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Role:</label>
                <select
                  name="role"
                  value={inputs.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Auction Coordinator">Auction Coordinator</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Item Inspector">Item Inspector</option>
                  <option value="Shipping Manager">Shipping Manager</option>
                </select>
              </div>
            </div>

            {/* Row 5: Department and Task */}
            <div className="input-row">
              <div>
                <label>Department:</label>
                <select
                  name="department"
                  value={inputs.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Auction">Auction</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Financial & Accounting">Financial & Accounting</option>
                  <option value="IT & Technical">IT & Technical</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Shipping">Shipping</option>
                </select>
              </div>
              <div>
                <label>Task:</label>
                <input
                  type="text"
                  name="task"
                  value={inputs.task}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="addEmp-button">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;