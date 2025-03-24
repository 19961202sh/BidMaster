import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";
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
       <Nav></Nav>
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
            
            <p>Do not have an account? <Link to="/register">Register</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
