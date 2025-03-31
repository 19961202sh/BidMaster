import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io'; 
import './UpdateEmployee.css'; // Reuse the same CSS file for consistency

function UpdateEmployee() {
    const [inputs, setInputs] = useState(null); // Initialize as null instead of an empty object
    const navigate = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                if (response.data && response.data.employee) {
                    setInputs(response.data.employee); // Assuming response.data.employee has the employee details
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };
        fetchHandler();
    }, [id]);

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const sendRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/api/employees/${id}`, {
                employeeId: String(inputs.employeeId),
                name: String(inputs.name),
                email: String(inputs.email),
                phone: String(inputs.phone),
                address: String(inputs.address),
                salary: String(inputs.salary),
                role: String(inputs.role),
                department: String(inputs.department),
                task: String(inputs.task),
            });
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
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

        await sendRequest();
        navigate("/employeeDashboard");
    };

    // Conditional rendering: show loading state until inputs are fetched
    if (!inputs) {
        return <div>Loading...</div>;
    }

    return (
        <div className="addEmp-container">
            <div className="addEmp-box">
                <div className="updateEmp-header">
                    {/* Go Back Button */}
                    <button onClick={() => navigate(-1)} className="go-back-button">
                        <IoIosArrowBack /> 
                    </button>
                </div>

                <h2 className="addEmp-header">Update Employee</h2>
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
                                    readOnly
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

                        <button type="submit" className="addEmp-button">
                            Update Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateEmployee;