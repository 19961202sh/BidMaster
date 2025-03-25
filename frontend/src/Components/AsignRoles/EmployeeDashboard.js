import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./EmployeeDashboard.css";  

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();  // Initialize navigation

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle Update
  const handleUpdate = (id) => {
    alert(`Update feature for Employee ID: ${id} (To be implemented)`);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
        if (response.ok) {
          setEmployees(employees.filter((employee) => employee._id !== id));
        } else {
          alert("Error deleting employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Employee Dashboard</h2><br></br>
        <button className="add-employee-btn" onClick={() => navigate("/add-employee")}>
          Add Employee
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.role}</td>
                <td>{employee.task}</td>
                <td>
                  <button className="update-btn" onClick={() => handleUpdate(employee._id)}>Update</button>
                  <button className="delete-btn" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No employees found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;
