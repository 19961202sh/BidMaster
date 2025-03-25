import React, { useState } from "react";
import "./AddEmployee.css"; // Import CSS file

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    task: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Employee added successfully!");
      setFormData({ name: "", employeeId: "", email: "", phone: "", address: "", role: "", task: "" });
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="form-container">   
     <div className="addEmp-box">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Employee ID:</label>
        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
          <option value="Seller">Seller</option>
          <option value="ItemInspector">Item Inspection Manager</option>
          <option value="ShippingManager">Shipping Manager</option>
        </select>

        <label>Task:</label>
        <input type="text" name="task" value={formData.task} onChange={handleChange} required />

        <button type="submit">Add Employee</button>
      </form>
    </div>
    </div>
  );
};

export default AddEmployee;
