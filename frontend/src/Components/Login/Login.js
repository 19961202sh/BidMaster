import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Login.css";


function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", credentials);
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div>
     
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Type your username"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Type your password"
                  onChange={handleChange}
                  required
                />
              </div>
            
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
            <div className="social-login">
              <p>or Sign Up Using</p>
              <div className="social-buttons">
                <button className="social-btn facebook">F</button>
                <button className="social-btn twitter">T</button>
                <button className="social-btn google">G</button>
              </div>
            </div>
            <div className="signup-link">
              <p>or</p>
              <Link to="/register">SIGN UP</Link>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default Login; 