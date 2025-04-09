import React, { useEffect, useState } from "react";
import "./Payroll.css"; // Import CSS file

const PayrollDashboard = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/payroll") // Adjust backend URL if needed
      .then((res) => res.json())
      .then((data) => {
        console.log("Payroll API Response:", data); // Debugging log
        setPayrollRecords(data.payrollRecords || []); // Ensure it's always an array
      })
      .catch((err) => console.error("Error fetching payroll:", err));
  }, []);

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">Payroll Records</h2>
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Commission</th>
            <th>Total Earnings</th>
            <th>Deductions</th>
            <th>Net Pay</th>
            <th>Month</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payrollRecords.length > 0 ? (
            payrollRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.employeeId}</td>
                <td>{record.role}</td>
                <td>{record.salary}</td>
                <td>{record.commission}</td>
                <td>{record.totalEarnings}</td>
                <td>{record.deductions}</td>
                <td>{record.netPay}</td>
                <td>{record.month}</td>
                <td className={`status-${record.status.toLowerCase()}`}>
                  {record.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-records">No payroll records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollDashboard;
