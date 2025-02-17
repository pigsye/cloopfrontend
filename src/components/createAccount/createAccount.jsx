import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import "./createAccount.scss";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email regex
  
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email format"; // ✅ Email validation
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"; // ✅ Password length check
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await API.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
  
        if (response.status === 201) {
          setModalMessage("Account created successfully! Redirecting to login...");
          setModalOpen(true);
  
          setTimeout(() => {
            setModalOpen(false);
            navigate("/login"); // Redirect to login page
          }, 2000);
        }
      } catch (err) {
        setModalMessage(err.response?.data?.error || "Failed to create account. Please try again.");
        setModalOpen(true);
      }
    }
  };

  return (
    <main className="create-account-page">
      <section className="create-account-container">
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Create Account</button>

        <p className="login-text">
            <Link to="/login">Login</Link>
        </p>
      </section>

      {modalOpen && (
        <div className="modal-overlay">
            <div className="modal">
            <button className="close-btn" onClick={() => setModalOpen(false)}>×</button>
            <p>{modalMessage}</p>
            </div>
        </div>
    )}
    </main>
  );
}