import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);  // To track checkbox state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email: must contain @ and end with .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email must contain '@' and end with '.com'.");
      return;
    }

    // Validate phone number: must be exactly 10 digits, no characters
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits with no characters.");
      return;
    }

    // Validate password: must be at least 8 characters
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Ensure terms are accepted
    if (!acceptTerms) {
      setError("You must accept the terms and conditions to register.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users", formData);

      // Check if registration was successful
      if (res.data.success) {
        alert("Registration successful! Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section className="register-container">
      <div className="register-box">
        <h2 className="register-header">Create an account</h2>

        {error && <p className="error-message">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={handleTermsChange}
              required
            />
            <label htmlFor="terms">
              I accept the{" "}
              <Link to="/terms" className="terms-link">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

          <div className="register-p">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
