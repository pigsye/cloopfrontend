import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { BASE_URL } from '../../api';
import './loginsystem.scss';

export default function LoginSystem() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');

    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password");
      } else if (err.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navigate to forgot password page
  };

  const handleResendVerification = () => {
    // Logic to resend verification email (API call)
    console.log("Resending verification email...");
    setError(null);
    setLoading(true);
    API.post(`${BASE_URL}/auth/resend-verification`, { email })
      .then(response => {
        // Handle successful resend
        console.log(response.data.message);
      })
      .catch(error => {
        // Handle error
        console.error("Error resending verification:", error);
        setError("Error resending verification email.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="login-links"> {/* Container for links */}
        <button type="button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
        <button type="button" onClick={handleResendVerification}>
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}