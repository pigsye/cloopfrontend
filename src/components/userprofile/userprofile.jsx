import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../api"; // Import API and BASE_URL
import "./userProfile.scss";

export default function UserProfile() {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate(); // Hook to redirect user
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await API.get(`/user/${id}`);
        const profileData = response.data.profile;

        // Construct full profile picture URL if a filename exists
        if (profileData.pfp) {
          profileData.pfp = `${BASE_URL}/uploads/${profileData.pfp}`;
        }

        setUserData(profileData);
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [id]);

  const startChat = async () => {
    try {
      const response = await API.post(`/start-chat/${id}`);

      if (response.status === 201 || response.status === 200) {
        const chatId = response.data.chat_id;
        navigate(`/chat?chat_id=${chatId}`); // Redirect to chat page with chat ID
      } else {
        alert("Failed to start chat.");
      }
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("An error occurred.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!userData) return <p className="error">User not found.</p>;

  return (
    <main className="user-profile-page">
      <section className="profile-info">
        <h1>{userData.username}'s Profile</h1>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <img
            src={userData.pfp || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        {/* Profile Information */}
        <div className="profile-field">
          <label>Name</label>
          <p>{userData.username}</p>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <p>{userData.email}</p>
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <p>{userData.phone || "No phone number provided"}</p>
        </div>
        <div className="profile-field">
          <label>Bio</label>
          <p>{userData.bio || "No bio available"}</p>
        </div>

        {/* Button to start chat */}
        <button className="start-chat-btn" onClick={startChat}>
          Start Chat
        </button>
      </section>
    </main>
  );
}