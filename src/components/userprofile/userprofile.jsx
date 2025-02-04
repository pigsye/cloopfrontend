import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./userProfile.scss";

export default function UserProfile() {
  // Simulated data for the user profile (replace with API call in the future)
  const [userData] = useState({
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+65 98765432",
    bio: "Hello! I'm Jane, a product designer from Singapore. Let's chat!",
    profilePicture: "https://via.placeholder.com/150", // Default profile picture
  });

  // Simulate starting a chat (later this can trigger a real chat functionality)
  const startChat = () => {
    alert(`Starting chat with ${userData.name}...`);
  };

  return (
    <main className="user-profile-page">
      <section className="profile-info">
        <h1>{userData.name}'s Profile</h1>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        {/* Profile Information */}
        <div className="profile-field">
          <label>Name</label>
          <p>{userData.name}</p>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <p>{userData.email}</p>
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <p>{userData.phone}</p>
        </div>
        <div className="profile-field">
          <label>Bio</label>
          <p>{userData.bio}</p>
        </div>

        {/* Button to start chat */}
        <button className="start-chat-btn" onClick={startChat}>
          Start Chat
        </button>
      </section>
    </main>
  );
}