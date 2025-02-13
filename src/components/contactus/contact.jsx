import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import API from "../../api";
import "./contact.scss";

export default function ContactUs() {
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // More strict email validation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    setFormData({ ...formData, messageType: e.target.value });
  };

  // Validate form when submitted
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "This field is required";
    if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.messageType) newErrors.messageType = "Please select a message type";
    if (!formData.message.trim()) newErrors.message = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      try {
        await API.post("/feedback", {
          message: formData.message,
        });

        setModalMessage("Your form has been submitted! Redirecting to homepage...");
        setModalOpen(true);

        setTimeout(() => {
          setModalOpen(false);
          navigate("/"); // Redirect user to homepage
        }, 3000);
      } catch (err) {
        setModalMessage("Failed to submit feedback. Please try again.");
        setModalOpen(true);
      }
    }
  };

  return (
    <main className="contact-page">
      {/* Contact Form - Step 1 */}
      <section className="contact-us">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} />
          {formSubmitted && errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} />
          {formSubmitted && errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>What is your message about?</label>
          <div className="radio-group">
            {["Inquiry", "Feedback", "Other"].map((option) => (
              <label key={option}>
                <input type="radio" name="messageType" value={option.toLowerCase()} checked={formData.messageType === option.toLowerCase()} onChange={handleRadioChange} />
                {option}
              </label>
            ))}
          </div>
          {formSubmitted && errors.messageType && <span className="error">{errors.messageType}</span>}
        </div>
      </section>

      {/* Contact Form - Step 2 */}
      <section className="contact-us">
        <div className="form-group">
          <label htmlFor="message">What would you like to say?</label>
          <textarea id="message" name="message" placeholder="Type your message here..." value={formData.message} onChange={handleChange} />
          {formSubmitted && errors.message && <span className="error">{errors.message}</span>}
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </section>

      {/* Modal Popup */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </main>
  );
}