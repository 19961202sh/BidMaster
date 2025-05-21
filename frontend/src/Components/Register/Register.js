import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(""); // "weak", "medium", "strong"
  const [step, setStep] = useState(1); // For progress indicator
  
  // Form validation state
  const [validation, setValidation] = useState({
    name: { valid: false, message: "" },
    username: { valid: false, message: "" },
    email: { valid: false, message: "" },
    phone: { valid: false, message: "" },
    password: { valid: false, message: "" },
    confirmPassword: { valid: false, message: "" }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
    
    // Validate field in real-time
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let isValid = false;
    let message = "";

    switch (name) {
      case "name":
        isValid = value.trim().length >= 2;
        message = isValid ? "" : "Name must be at least 2 characters";
        break;
      case "username":
        isValid = /^[a-zA-Z0-9_]{3,}$/.test(value);
        message = isValid ? "" : "Username must be at least 3 characters, no special characters except underscore";
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = isValid ? "" : "Please enter a valid email address";
        break;
      case "phone":
        isValid = /^\d{10}$/.test(value);
        message = isValid ? "" : "Phone number must be 10 digits";
        break;
      case "password":
        // Check password strength
        if (value.length < 8) {
          isValid = false;
          message = "Password must be at least 8 characters";
          setPasswordStrength("weak");
        } else if (/^[a-zA-Z0-9]+$/.test(value)) {
          isValid = true;
          message = "Consider adding special characters for stronger password";
          setPasswordStrength("medium");
        } else {
          isValid = true;
          message = "";
          setPasswordStrength("strong");
        }
        
        // Also update confirm password validation
        if (formData.confirmPassword) {
          const confirmValid = value === formData.confirmPassword;
          setValidation(prev => ({
            ...prev,
            confirmPassword: {
              valid: confirmValid,
              message: confirmValid ? "" : "Passwords do not match"
            }
          }));
        }
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        message = isValid ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    setValidation(prev => ({
      ...prev,
      [name]: { valid: isValid, message }
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Calculate form completion percentage for progress bar
  const calculateProgress = () => {
    const fields = Object.keys(validation);
    const validFields = fields.filter(field => validation[field].valid);
    return Math.round((validFields.length / fields.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check
    let formIsValid = true;
    let firstInvalidField = null;

    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
      if (!validation[field]?.valid && formIsValid) {
        formIsValid = false;
        firstInvalidField = field;
      }
    });

    // Ensure terms are accepted
    if (!acceptTerms) {
      setError("You must accept the terms and conditions to register.");
      return;
    }

    if (!formIsValid) {
      setError(`Please fix the errors in the form${firstInvalidField ? `: ${validation[firstInvalidField].message}` : ''}`);
      // Focus the first invalid field
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users", formData);

      // Check if registration was successful
      if (res.data.success) {
        // Show success state
        setStep(3); // Complete
        
        // Redirect after 2 seconds
        setTimeout(() => {
          alert("Registration successful! Please log in.");
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <section className="RF-register-container">
      <div className="RF-register-box">
        <h2 className="RF-register-header">Create an account</h2>
        
        <div className="RF-form-progress">
          
        </div>

        {error && <p className="RF-error-message">{error}</p>}

        <form className="RF-register-form" onSubmit={handleSubmit}>
          <div className="RF-input-group">
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
            <FaUser className="RF-input-icon" />
            {validation.name.message && <span className="RF-validation-message">{validation.name.message}</span>}
          </div>

          <div className="RF-input-group">
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
            <FaUser className="RF-input-icon" />
            {validation.username.message && <span className="RF-validation-message">{validation.username.message}</span>}
          </div>

          <div className="RF-input-group">
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
            <FaEnvelope className="RF-input-icon" />
            {validation.email.message && <span className="RF-validation-message">{validation.email.message}</span>}
          </div>

          <div className="RF-input-group">
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
            <FaPhone className="RF-input-icon" />
            {validation.phone.message && <span className="RF-validation-message">{validation.phone.message}</span>}
          </div>

          <div className="RF-input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FaLock className="RF-input-icon" />
            <button 
              type="button" 
              className="RF-password-toggle" 
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {validation.password.message && <span className="RF-validation-message">{validation.password.message}</span>}
            <div className={`RF-password-strength ${passwordStrength}`}>
              <div className="RF-password-strength-meter"></div>
            </div>
          </div>

          <div className="RF-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <FaLock className="RF-input-icon" />
            <button 
              type="button" 
              className="RF-password-toggle" 
              onClick={toggleConfirmPasswordVisibility}
              tabIndex="-1"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {validation.confirmPassword.message && <span className="RF-validation-message">{validation.confirmPassword.message}</span>}
          </div>

          <div className="RF-terms">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={handleTermsChange}
              required
            />
            <label htmlFor="terms">
              I accept the{" "}
              <Link to="/terms" className="RF-terms-link">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <button type="submit" className="RF-register-button">
            Register
          </button>

          <div className="RF-register-p">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="RF-login-link">
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