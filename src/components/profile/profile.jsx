import React, { useState } from "react";
import "./Profile.scss";

export default function Profile() {
  // User data (this will later be fetched from an API)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "91234567", // Phone number without +65
    bio: "This is a sample bio. User can update their bio here.",
    profilePicture: "https://via.placeholder.com/150", // Default profile picture
  });

  // State to track the edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State to track validation errors
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle profile picture change (simulate file upload for now)
  const handleProfilePictureChange = () => {
    // Simulate profile picture change by setting a new image URL
    const newProfilePicture = prompt("Enter new profile picture URL:");
    if (newProfilePicture) {
      setUserData({ ...userData, profilePicture: newProfilePicture });
    }
  };

  // Phone number validation (Starts with 8 or 9 followed by 7 more digits)
  const validatePhoneNumber = (phone) => {
    const regex = /^[89]\d{7}$/;  // Regex to match Singapore phone number starting with 8 or 9, followed by 7 digits
    return regex.test(phone);
  };

  // Email validation (basic email format)
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Basic email format validation
    return regex.test(email);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle form validation and save changes
  const handleSaveChanges = (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Validate fields
    if (!userData.name.trim()) validationErrors.name = "Name is required.";
    if (!validateEmail(userData.email)) validationErrors.email = "Please enter a valid email (e.g. text@text.text).";
    if (!validatePhoneNumber(userData.phone)) validationErrors.phone = "Phone number must start with 8 or 9 and be 8 digits long.";
    if (!userData.bio.trim()) validationErrors.bio = "Bio is required.";

    // Set errors and validation state
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsFormValid(false);
    } else {
      setErrors({});
      setIsFormValid(true);
      setIsEditing(false);  // Exit edit mode after successful validation
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-info">
        <h1>{isEditing ? "Edit Profile" : "Profile"}</h1>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="profile-picture"
          />
          <button
            className="change-profile-picture-btn"
            onClick={handleProfilePictureChange}
          >
            Change Profile Picture
          </button>
        </div>

        {/* Form fields */}
        <div className="profile-field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="profile-field">
          <label>Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.bio && <span className="error">{errors.bio}</span>}
        </div>

        {/* Button to toggle between view and edit modes */}
        <button className="edit-btn" onClick={isEditing ? handleSaveChanges : toggleEditMode}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </section>
    </main>
  );
}