import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import "./login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
  
        console.log("Login API Response:", response.data); // Debug
  
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Stored Token in localStorage:", localStorage.getItem("token")); // Debug
  
          setModalMessage("Login successful! Redirecting...");
          setModalOpen(true);
  
          setTimeout(() => {
            setModalOpen(false);
            navigate("/");
          }, 2000);
        } else {
          setModalMessage("Invalid login response.");
          setModalOpen(true);
        }
      } catch (err) {
        console.error("Login error:", err.response?.data || err);
        setModalMessage(err.response?.data?.error || "Invalid email or password.");
        setModalOpen(true);
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <h2>Login</h2>
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

        <button className="submit-btn" onClick={handleSubmit}>Login</button>
        <Link to="/create-account">Sign Up</Link>
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
